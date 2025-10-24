import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

import { BetCalculationService } from '../services/BetCalculationService';
import { BetService } from '../services/BetService';
import { CreateBetDto } from '../dto/CreateBet.dto';
import { UpdateBetDto } from '../dto/UpdateBet.dto';

@ApiTags('Bet')
@Controller('bets')
export class BetController {
  constructor(
    private readonly betCalculationService: BetCalculationService,
    private readonly betservice: BetService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'placer un pari' })
  @ApiResponse({
    status: 201,
    description: 'Pari créé avec succès',
  })
  @ApiResponse({ status: 409, description: 'Pari déjà créée' })
  @ApiBody({ type: CreateBetDto })
  async placeBet(@Request() req, @Body() createBetDto: CreateBetDto) {
    const userId = req.user.id; // automatiquement récupéré depuis le JWT
    return await this.betservice.create(userId, createBetDto);
  }

  @Get('calculate/potential-win')
  @ApiOperation({ summary: 'Calcule le gain potentiel d’un pari' })
  @ApiResponse({ status: 200, description: 'Gain potentiel calculé' })
  async calculatePotentialWin(
    @Query('amount') amount: number,
    @Query('odds') odds: number,
  ) {
    return {
      potential_win: this.betCalculationService.calculatePotentialWin(
        Number(amount),
        Number(odds),
      ),
    };
  }

  @Get('calculate/profit')
  @ApiOperation({ summary: 'Calcule le profit net d’un pari' })
  @ApiResponse({ status: 200, description: 'Profit net calculé' })
  async calculateProfit(
    @Query('amount') amount: number,
    @Query('odds') odds: number,
  ) {
    return {
      profit: this.betCalculationService.calculateProfit(
        Number(amount),
        Number(odds),
      ),
    };
  }
  @Get('validate/odds')
  @ApiOperation({ summary: 'Vérifie si une cote est valide' })
  @ApiResponse({ status: 200, description: 'Validité de la cote' })
  async isValidOdds(@Query('odds') odds: number) {
    return {
      isValid: this.betCalculationService.isValidOdds(Number(odds)),
    };
  }

  @Get('calculate/implied-probability')
  @ApiOperation({ summary: 'Calcule la probabilité implicite d’une cote' })
  @ApiResponse({ status: 200, description: 'Probabilité calculée' })
  async calculateImpliedProbability(@Query('odds') odds: number) {
    return {
      implied_probability:
        this.betCalculationService.calculateImpliedProbability(Number(odds)),
    };
  }

  @Post('calculate/accumulator-odds')
  @ApiOperation({ summary: 'Calcule la cote totale d’un pari combiné' })
  @ApiResponse({ status: 200, description: 'Cote combinée calculée' })
  async calculateAccumulatorOdds(@Body('odds') odds: number[]) {
    return {
      accumulator_odds:
        this.betCalculationService.calculateAccumulatorOdds(odds),
    };
  }

  @Get('calculate/roi')
  @ApiOperation({ summary: 'Calcule le retour sur investissement (ROI)' })
  @ApiResponse({ status: 200, description: 'ROI calculé' })
  async calculateROI(
    @Query('totalStaked') totalStaked: number,
    @Query('totalReturned') totalReturned: number,
  ) {
    return {
      roi: this.betCalculationService.calculateROI(
        Number(totalStaked),
        Number(totalReturned),
      ),
    };
  }
}
