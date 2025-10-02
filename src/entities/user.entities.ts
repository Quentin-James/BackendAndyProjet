import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bet } from './bets.entities';
import { Transaction } from './transaction.entities'; // ✅ Import correct
import { AuthToken } from './auth_tokens.entities'; // ✅ Import ajouté

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];

  @OneToMany(() => Transaction, (transaction) => transaction.user) // ✅ Transaction au lieu de transactions
  transactions: Transaction[];

  @OneToMany(() => AuthToken, (authToken) => authToken.user) // ✅ Ajouté
  authTokens: AuthToken[];
}
