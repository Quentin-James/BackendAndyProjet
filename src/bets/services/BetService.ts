import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet, BetStatus } from '../../entities/bets.entities';
import { User } from '../../entities/user.entities';
import { Match } from '../../entities/matches.entities';
import { ICreateBet, IBetResponse } from '../interfaces/bet.interface';
import { BetCalculationService } from './BetCalculationService';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly betCalculationService: BetCalculationService,
  ) {}

  async create(
    userId: number,
    createBetData: ICreateBet,
  ): Promise<IBetResponse> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier que le match existe
    const match = await this.matchRepository.findOne({
      where: { id: createBetData.match_id },
    });
    if (!match) {
      throw new NotFoundException('Match non trouvé');
    }

    // Vérifier que l'utilisateur a suffisamment de fonds
    if (user.balance < createBetData.amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    // Valider les cotes
    if (!this.betCalculationService.isValidOdds(createBetData.odds)) {
      throw new BadRequestException(
        'Cote invalide (doit être entre 1.01 et 100)',
      );
    }

    // Calculer le gain potentiel
    const potential_win = this.betCalculationService.calculatePotentialWin(
      createBetData.amount,
      createBetData.odds,
    );

    // Créer le pari
    const bet = this.betRepository.create({
      user_id: userId,
      match_id: createBetData.match_id,
      team_id: createBetData.team_id,
      amount: createBetData.amount,
      odds: createBetData.odds,
      potential_win,
      status: BetStatus.PENDING,
    });

    // Déduire le montant du solde de l'utilisateur
    user.balance -= createBetData.amount;
    await this.userRepository.save(user);

    const savedBet = await this.betRepository.save(bet);

    return {
      id: savedBet.id,
      amount: savedBet.amount,
      odds: savedBet.odds,
      potential_win: savedBet.potential_win,
      status: savedBet.status,
      created_at: savedBet.created_at,
      user_id: savedBet.user_id,
      match_id: savedBet.match_id,
      team_id: savedBet.team_id,
    };
  }

  async findById(id: number): Promise<Bet | null> {
    return await this.betRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Bet[]> {
    return await this.betRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findByMatchId(matchId: number): Promise<Bet[]> {
    return await this.betRepository.find({
      where: { match_id: matchId },
      order: { created_at: 'DESC' },
    });
  }

  async settleBet(betId: number, isWin: boolean): Promise<IBetResponse> {
    const bet = await this.findById(betId);
    if (!bet) {
      throw new NotFoundException('Pari non trouvé');
    }

    if (bet.status !== BetStatus.PENDING) {
      throw new BadRequestException('Ce pari a déjà été réglé');
    }

    const user = await this.userRepository.findOne({
      where: { id: bet.user_id },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Mettre à jour le statut et le solde de l'utilisateur
    if (isWin) {
      bet.status = BetStatus.WIN;
      user.balance += bet.potential_win;
    } else {
      bet.status = BetStatus.LOSE;
      // Le montant a déjà été déduit lors de la création du pari
    }

    await this.userRepository.save(user);
    const updatedBet = await this.betRepository.save(bet);

    return {
      id: updatedBet.id,
      amount: updatedBet.amount,
      odds: updatedBet.odds,
      potential_win: updatedBet.potential_win,
      status: updatedBet.status,
      created_at: updatedBet.created_at,
      user_id: updatedBet.user_id,
      match_id: updatedBet.match_id,
      team_id: updatedBet.team_id,
    };
  }

  async cancelBet(betId: number): Promise<void> {
    const bet = await this.findById(betId);
    if (!bet) {
      throw new NotFoundException('Pari non trouvé');
    }

    if (bet.status !== BetStatus.PENDING) {
      throw new BadRequestException(
        'Seuls les paris en attente peuvent être annulés',
      );
    }

    // Rembourser l'utilisateur
    const user = await this.userRepository.findOne({
      where: { id: bet.user_id },
    });
    if (user) {
      user.balance += bet.amount;
      await this.userRepository.save(user);
    }

    await this.betRepository.delete(betId);
  }

  async getUserBetStats(userId: number) {
    const bets = await this.findByUserId(userId);

    const totalBets = bets.length;
    const wonBets = bets.filter((b) => b.status === BetStatus.WIN).length;
    const lostBets = bets.filter((b) => b.status === BetStatus.LOSE).length;
    const pendingBets = bets.filter(
      (b) => b.status === BetStatus.PENDING,
    ).length;

    const totalStaked = bets.reduce((sum, bet) => sum + Number(bet.amount), 0);
    const totalReturned = bets
      .filter((b) => b.status === BetStatus.WIN)
      .reduce((sum, bet) => sum + Number(bet.potential_win), 0);

    const roi = this.betCalculationService.calculateROI(
      totalStaked,
      totalReturned,
    );

    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalStaked,
      totalReturned,
      profit: totalReturned - totalStaked,
      roi,
      winRate: totalBets > 0 ? (wonBets / totalBets) * 100 : 0,
    };
  }
}
