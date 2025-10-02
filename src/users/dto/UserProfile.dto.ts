import { Expose } from 'class-transformer';
import { UserRole } from '../../entities/user.entities';

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  role: UserRole;

  @Expose()
  created_at: Date;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
