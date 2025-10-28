import { Module } from '@nestjs/common';
//import { AppController } from './Controller/app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './config/DbConfig';
import { ConfigModule } from '@nestjs/config';
import { BetModule } from './auth/auth/bet.module';
import { UserSubscriber } from './subscriber/user.subscriber';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // dispo partout dans ton app
    }),
    TypeOrmModule.forRoot({
      ...pgConfig,
      subscribers: [UserSubscriber],
    }),
    UsersModule,
    BetModule,
  ],
  //controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
