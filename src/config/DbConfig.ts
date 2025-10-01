import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import { User } from '../entities/user.entities';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'parieur',
  password: 'parieur',
  database: 'andybdd',
  entities: [User], // Plus précis
  synchronize: true,
  migrations: ['src/migrations/*{.ts,.js}'],
  logging: true,
};

export const AppDataSource = new DataSource(pgConfig);
