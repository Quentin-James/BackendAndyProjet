import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity('auth_tokens')
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.authTokens, {
    // ✅ Corrigé: authTokens au lieu de auth_token
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column({ unique: true, length: 255 })
  refresh_token: string;

  @Column()
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
