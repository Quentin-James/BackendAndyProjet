import { BetStatus } from '../../entities/bets.entities';

export interface IBet {
  id: number;
  amount: number;
  odds: number;
  potential_win: number;
  status: BetStatus;
  created_at: Date;
  user_id: number;
  match_id: number;
  team_id: number;
}

export interface ICreateBet {
  match_id: number;
  team_id: number;
  amount: number;
  odds: number;
}

export interface IUpdateBet {
  amount?: number;
  odds?: number;
  potential_win?: number;
  status?: BetStatus;
}

export interface IBetResponse {
  id: number;
  amount: number;
  odds: number;
  potential_win: number;
  status: BetStatus;
  created_at: Date;
  user_id: number;
  match_id: number;
  team_id: number;
}

export interface IMatchOdds {
  match_id: number;
  team1_id: number;
  team1_odds: number;
  team2_id: number;
  team2_odds: number;
  draw_odds?: number;
  updated_at: Date;
}

export interface IBetCalculation {
  amount: number;
  odds: number;
  potential_win: number;
  profit: number;
  implied_probability: number;
}
