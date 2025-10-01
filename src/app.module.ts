import { Module } from '@nestjs/common';
//import { AppController } from './Controller/app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'parieur',
      password: 'parieur',
      database: 'andybdd',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  //controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
export const getAppConfig = (configService: ConfigService) => ({
  port: configService.get<number>('PORT') || 3000,
  nodeEnv: configService.get<string>('NODE_ENV') || 'development',
});
