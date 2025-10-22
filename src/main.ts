import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Esport Bet API')
    .setDescription('API pour les paris esport')
    .setVersion('1.0')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Bets', 'Gestion des paris')
    .addTag('Matches', 'Gestion des matchs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
