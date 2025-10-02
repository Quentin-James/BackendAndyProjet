import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Match } from './matches.entities';

export enum TournamentStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100 })
  game: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  prize_pool: number;

  @Column({ nullable: true, length: 255 })
  logo_url: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.UPCOMING,
  })
  status: TournamentStatus;

  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];

  @CreateDateColumn()
  created_at: Date;
}
