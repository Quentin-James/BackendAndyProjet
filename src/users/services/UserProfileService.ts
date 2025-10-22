import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entities';
import { Bet, BetStatus } from '../../entities/bets.entities';
import { Transaction } from '../../entities/transaction.entities';
import { IUserProfile } from '../interfaces/user.interface';
import { UserService } from './UserService';

export interface IUserStats {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  winRate: number;
  profit: number;
}

export interface IUserProfileWithStats extends IUserProfile {
  stats: IUserStats;
}

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly userService: UserService,
  ) {}

  async getPublicProfile(userId: number): Promise<IUserProfile> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    };
  }

  async getProfileWithStats(userId: number): Promise<IUserProfileWithStats> {
    const profile = await this.getPublicProfile(userId);
    const stats = await this.getUserStats(userId);

    return {
      ...profile,
      stats,
    };
  }

  async getUserStats(userId: number): Promise<IUserStats> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const bets = await this.betRepository.find({ where: { user_id: userId } });

    const totalBets = bets.length;
    const wonBets = bets.filter((bet) => bet.status === BetStatus.WIN).length;
    const lostBets = bets.filter((bet) => bet.status === BetStatus.LOSE).length;
    const pendingBets = bets.filter(
      (bet) => bet.status === BetStatus.PENDING,
    ).length;

    const totalWagered = bets.reduce((sum, bet) => sum + Number(bet.amount), 0);
    const totalWon = bets
      .filter((bet) => bet.status === BetStatus.WIN)
      .reduce(
        (sum, bet) => sum + Number(bet.potential_win || bet.amount * bet.odds),
        0,
      );
    const totalLost = bets
      .filter((bet) => bet.status === BetStatus.LOSE)
      .reduce((sum, bet) => sum + Number(bet.amount), 0);

    const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;
    const profit = totalWon - totalLost;

    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalWagered,
      totalWon,
      totalLost,
      winRate: Math.round(winRate * 100) / 100,
      profit,
    };
  }

  async getLeaderboard(limit: number = 10): Promise<IUserProfile[]> {
    const users = await this.userRepository.find({
      order: { balance: 'DESC' },
      take: limit,
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    }));
  }

  async getRecentActivity(userId: number, limit: number = 10) {
    const [recentBets, recentTransactions] = await Promise.all([
      this.betRepository.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
        take: limit,
      }),
      this.transactionRepository.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
        take: limit,
      }),
    ]);

    return {
      recentBets,
      recentTransactions,
    };
  }
}
