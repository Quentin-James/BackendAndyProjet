import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entities';
import { Bet } from '../entities/bets.entities';
import { Transaction } from '../entities/transaction.entities';
import { AuthToken } from '../entities/auth_tokens.entities';
import { UserService } from './services/UserService';
import { UserAuthService } from './services/UserAuthService';
import { UserProfileService } from './services/UserProfileService';
import { UsersController } from './controllers/app.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Bet, Transaction, AuthToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UserService, UserAuthService, UserProfileService],
  exports: [UserService, UserAuthService, UserProfileService],
})
export class UsersModule {}
