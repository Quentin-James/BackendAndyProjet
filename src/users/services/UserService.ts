import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { Repository } from 'typeorm';
import {
  ICreateUser,
  IUser,
  IUserProfile,
  IUserResponse,
} from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserData: ICreateUser): Promise<IUserResponse> {
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
    //Soit on retourne un utilisateur soit null
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
}
