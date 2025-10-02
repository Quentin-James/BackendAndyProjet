import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Team } from './team.entities';
import { Bet } from './bets.entities';
export enum MatchStatus {
  PENDING = 'pending',
  FINISHED = 'finish',
  INPROGRESS = 'in progress',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  date: Date;
  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING,
  })
  status: MatchStatus;
  @Column({ nullable: true, default: null })
  score_a: number;

  @Column({ nullable: true, default: null })
  score_b: number;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'winner_id' })
  winner: Team;

  @Column({ nullable: true })
  winner_id: number;

  @OneToMany(() => Bet, (bet) => bet.match)
  bets: Bet[];
}
