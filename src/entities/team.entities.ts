import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Bet } from './bets.entities';
import { Player } from './player.entities';
import { Match } from './matches.entities';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  logo_url: string;

  @Column({ length: 50, nullable: true })
  region: string;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @ManyToMany(() => Player, (player) => player.teams)
  @JoinTable({
    name: 'team_players',
    joinColumn: { name: 'team_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'player_id', referencedColumnName: 'id' },
  })
  players: Player[];

  @OneToMany(() => Match, (match) => match.team1)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.team2)
  awayMatches: Match[];

  @OneToMany(() => Match, (match) => match.winner)
  wonMatches: Match[];

  @OneToMany(() => Bet, (bet) => bet.team)
  bets: Bet[];
}
