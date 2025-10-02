import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { Team } from './team.entities';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  game_tag: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  birth_date: Date;

  @Column({ length: 50, nullable: true })
  nationality: string;

  @Column({ nullable: true, length: 255 })
  avatar_url: string;

  @ManyToMany(() => Team, (team) => team.players)
  teams: Team[];

  @CreateDateColumn()
  created_at: Date;
}
