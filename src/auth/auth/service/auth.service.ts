import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthToken } from '../../../entities/auth_tokens.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthToken)
    private authTokenRepository: Repository<AuthToken>,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string, userService: any) {
    const user = await userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Sauvegarde du refresh token
    await this.authTokenRepository.save({
      user_id: user.id,
      refresh_token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    });

    return { access_token, refresh_token };
  }

  async refreshToken(refresh_token: string) {
    const tokenRecord = await this.authTokenRepository.findOne({
      where: { refresh_token },
      relations: ['user'],
    });

    if (!tokenRecord || tokenRecord.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    // Générer un nouveau access_token
    const payload = {
      sub: tokenRecord.user.id,
      username: tokenRecord.user.username,
      email: tokenRecord.user.email,
    };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async logout(refresh_token: string) {
    await this.authTokenRepository.delete({ refresh_token });
    return { message: 'Déconnexion réussie' };
  }
}
