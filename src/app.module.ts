import { Module } from '@nestjs/common';
//import { AppController } from './Controller/app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './config/DbConfig';
@Module({
  imports: [TypeOrmModule.forRoot(pgConfig)],
  //controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
