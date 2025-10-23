import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entities';
import { AuthToken } from '../../entities/auth_tokens.entities';
import {
  ICreateUser,
  ILoginUser,
  IUserResponse,
  IChangePassword,
  IChangeEmail,
} from '../interfaces/user.interface';
import { UserService } from './UserService';

@Injectable()
export class UserAuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createUserData: ICreateUser): Promise<IUserResponse> {
    const password_hash = await bcrypt.hash(
      createUserData.password,
      this.saltRounds,
    );

    const userData = {
      username: createUserData.username,
      email: createUserData.email,
      password_hash,
      role: createUserData.role,
    };

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    const { password_hash: _, ...userResponse } = savedUser;
    return userResponse;
  }

  async login(loginData: ILoginUser): Promise<{
    access_token: string;
    refresh_token: string;
    user: IUserResponse;
  }> {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Sauvegarder le refresh token
    await this.saveRefreshToken(user.id, refresh_token);

    const { password_hash, ...userResponse } = user;

    return {
      access_token,
      refresh_token,
      user: userResponse,
    };
  }

  private async saveRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours

    // Supprimer les anciens tokens de cet utilisateur
    await this.authTokenRepository.delete({ user_id: userId });

    await this.authTokenRepository.save({
      user_id: userId,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authTokenRepository.delete({ refresh_token: refreshToken });
  }

  async validateRefreshToken(refreshToken: string): Promise<User | null> {
    const tokenRecord = await this.authTokenRepository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
    });

    if (!tokenRecord || tokenRecord.expires_at < new Date()) {
      return null;
    }

    return tokenRecord.user;
  }

  async changePassword(
    userId: number,
    changePasswordData: IChangePassword,
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordData.currentPassword,
      user.password_hash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    const newPasswordHash = await bcrypt.hash(
      changePasswordData.newPassword,
      this.saltRounds,
    );

    await this.userRepository.update(userId, {
      password_hash: newPasswordHash,
    });
  }

  async changeEmail(
    userId: number,
    changeEmailData: IChangeEmail,
  ): Promise<IUserResponse> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      changeEmailData.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mot de passe incorrect');
    }

    // Vérifier que le nouvel email n'est pas déjà utilisé
    const existingUser = await this.userService.findByEmail(
      changeEmailData.newEmail,
    );
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier que le nouvel email est différent de l'actuel
    if (user.email === changeEmailData.newEmail) {
      throw new BadRequestException(
        "Le nouvel email est identique à l'email actuel",
      );
    }

    await this.userRepository.update(userId, {
      email: changeEmailData.newEmail,
    });

    const updatedUser = await this.userService.findById(userId);
    if (!updatedUser) {
      throw new UnauthorizedException('Erreur lors de la mise à jour');
    }

    const { password_hash, ...userResponse } = updatedUser;

    return userResponse;
  }

  async validateUser(id: number): Promise<IUserResponse | null> {
    const user = await this.userService.findById(id);
    if (!user) {
      return null;
    }

    const { password_hash, ...userResponse } = user;
    return userResponse;
  }

  async refreshToken(userId: number): Promise<{ access_token: string }> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password_hash);
  }
}
