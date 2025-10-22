import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../../entities/user.entities';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password_hash: string;

  @Expose()
  balance: number;

  @Expose()
  role: UserRole;

  @Expose()
  created_at: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
// sert à définir clairement ce que l'api retourne.
