import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bet } from './bets.entities';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  logo_url: string;

  @OneToMany(() => Bet, (bet) => bet.team)
  bets: Bet[];
}
