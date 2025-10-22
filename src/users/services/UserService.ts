import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entities';
import {
  IUser,
  ICreateUser,
  IUpdateUser,
  IUserResponse,
} from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserData: ICreateUser): Promise<IUserResponse> {
    // Vérifier l'unicité
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserData.email },
        { username: createUserData.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException("Email ou nom d'utilisateur déjà utilisé");
    }

    const user = this.userRepository.create(createUserData);
    const savedUser = await this.userRepository.save(user);

    const { password_hash, ...userResponse } = savedUser;
    return userResponse;
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user || null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user || null;
  }

  async update(id: number, updateData: IUpdateUser): Promise<IUserResponse> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Vérifier l'unicité si email/username sont modifiés
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await this.findByEmail(updateData.email);
      if (existingEmail) {
        throw new ConflictException('Email déjà utilisé');
      }
    }

    if (updateData.username && updateData.username !== user.username) {
      const existingUsername = await this.findByUsername(updateData.username);
      if (existingUsername) {
        throw new ConflictException("Nom d'utilisateur déjà utilisé");
      }
    }

    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findById(id);

    if (!updatedUser) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${id} non trouvé après mise à jour`,
      );
    }

    const { password_hash, ...userResponse } = updatedUser as IUser & {
      password_hash?: string;
    };
    return userResponse;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    await this.userRepository.delete(id);
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.userRepository.find();

    return users.map((user) => {
      const { password_hash, ...userResponse } = user;
      return userResponse;
    });
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }
}
