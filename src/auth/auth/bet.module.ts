import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Bet } from '../../entities/bets.entities';
import { User } from '../../entities/user.entities';
import { Match } from '../../entities/matches.entities';
import { AuthToken } from '../../entities/auth_tokens.entities';
import { BetController } from '../../bets/controllers/app.controller';
import { BetService } from '../../bets/services/BetService';
import { BetCalculationService } from '../../bets/services/BetCalculationService';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, User, Match, AuthToken]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [BetController],
  providers: [BetService, BetCalculationService],
  exports: [BetService, BetCalculationService],
})
export class BetModule {}
