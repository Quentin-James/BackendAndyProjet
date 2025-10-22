import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Team } from './team.entities';
import { Match } from './matches.entities';
import { User } from './user.entities';

export enum BetStatus {
  PENDING = 'pending',
  WIN = 'win',
  LOSE = 'lose',
}

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 5, scale: 2 })
  odds: number;

  @Column('decimal', { precision: 10, scale: 2 })
  potential_win: number;

  @Column({
    type: 'enum',
    enum: BetStatus,
    default: BetStatus.PENDING,
  })
  status: BetStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.bets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Match, (match) => match.bets)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column()
  match_id: number;

  @ManyToOne(() => Team, (team) => team.bets)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column()
  team_id: number;
}
