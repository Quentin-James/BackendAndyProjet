import { ConfigService } from '@nestjs/config';

export const getAppConfig = (configService: ConfigService) => ({
  port: configService.get<number>('PORT') || 3000,
  nodeEnv: configService.get<string>('NODE_ENV') || 'development',
});
