import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BetStatus } from '../../entities/bets.entities';

export class UpdateBetDto {
  @ApiProperty({
    description: 'Nouveau montant du pari en euros',
    example: 75.0,
    minimum: 0.01,
    type: 'number',
    format: 'decimal',
    required: false,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Le montant doit être un nombre avec 2 décimales maximum' },
  )
  @Min(0.01, { message: 'Le montant minimum est de 0.01€' })
  amount?: number;

  @ApiProperty({
    description: 'Nouvelle cote du pari',
    example: 3.2,
    minimum: 1.01,
    maximum: 100,
    type: 'number',
    format: 'decimal',
    required: false,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La cote doit être un nombre avec 2 décimales maximum' },
  )
  @Min(1.01, { message: 'La cote minimum est de 1.01' })
  @Max(100, { message: 'La cote maximum est de 100' })
  odds?: number;

  @ApiProperty({
    description: 'Nouveau statut du pari',
    example: BetStatus.WIN,
    enum: BetStatus,
    enumName: 'BetStatus',
    required: false,
  })
  @IsOptional()
  @IsEnum(BetStatus, { message: 'Statut invalide' })
  status?: BetStatus;
}
