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
}
