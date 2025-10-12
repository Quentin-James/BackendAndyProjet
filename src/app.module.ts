import { Module } from '@nestjs/common';
//import { AppController } from './Controller/app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './config/DbConfig';
@Module({
  imports: [TypeOrmModule.forRoot(pgConfig), UsersModule],
  //controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
