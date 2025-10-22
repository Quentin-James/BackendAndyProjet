import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entities';
import { Bet } from '../entities/bets.entities';
import { Transaction } from '../entities/transaction.entities';
import { UserService } from './services/UserService';
import { UserAuthService } from './services/UserAuthService';
import { UserProfileService } from './services/UserProfileService';
import { UsersController } from './controllers/app.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Bet, Transaction]),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UserService, UserAuthService, UserProfileService],
  exports: [UserService, UserAuthService, UserProfileService],
})
export class UsersModule {}

