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
import { Tournament } from './tournament.entities';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column()
  tournament_id: number;

  @ManyToOne(() => Team, (team) => team.homeMatches)
  @JoinColumn({ name: 'team1_id' })
  team1: Team;

  @Column()
  team1_id: number;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  @JoinColumn({ name: 'team2_id' })
  team2: Team;

  @Column()
  team2_id: number;

  @ManyToOne(() => Team, (team) => team.wonMatches, { nullable: true })
  @JoinColumn({ name: 'winner_id' })
  winner: Team;

  @Column({ nullable: true })
  winner_id: number;

  @Column()
  scheduled_at: Date;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({ nullable: true })
  score1: number;

  @Column({ nullable: true })
  score2: number;

  @Column({ length: 50, default: 'Bo3' })
  format: string;

  @OneToMany(() => Bet, (bet) => bet.match)
  bets: Bet[];

  @CreateDateColumn()
  created_at: Date;
}
