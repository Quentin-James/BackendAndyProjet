import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../entities/user.entities';
import { Team } from '../entities/team.entities';
import { Match } from '../entities/matches.entities';
import { Bet } from '../entities/bets.entities';
import { Transaction } from '../entities/transaction.entities';
import { AuthToken } from '../entities/auth_tokens.entities';
import { Tournament } from '../entities/tournament.entities';
import { Player } from '../entities/player.entities';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'parieur',
  password: 'parieur',
  database: 'andybdd',
  entities: [
    User,
    Team,
    Match,
    Bet,
    Transaction,
    AuthToken,
    Tournament,
    Player,
  ],
  //passer a true pour auto sur bdd quand npm rn start
  synchronize: false,
  logging: true,
};

const AppDataSource = new DataSource(pgConfig);
export default AppDataSource;
