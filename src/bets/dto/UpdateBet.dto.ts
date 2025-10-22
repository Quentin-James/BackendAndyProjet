import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { BetStatus } from '../../entities/bets.entities';

export class UpdateBetDto {
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Le montant doit être un nombre avec 2 décimales maximum' },
  )
  @Min(0.01, { message: 'Le montant minimum est de 0.01€' })
  amount?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La cote doit être un nombre avec 2 décimales maximum' },
  )
  @Min(1.01, { message: 'La cote minimum est de 1.01' })
  @Max(100, { message: 'La cote maximum est de 100' })
  odds?: number;

  @IsOptional()
  @IsEnum(BetStatus, { message: 'Statut invalide' })
  status?: BetStatus;
}
