import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';

export enum TransactionType {
  DEPOSIT = 'deposit',
  BET = 'bet',
  WIN = 'win',
  WITHDRAW = 'withdraw',
  LOSS = 'loss',
}

@Entity('transactions')
export class Transaction {
  // ✅ Nom de classe avec majuscule
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  balance_after: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;
}
