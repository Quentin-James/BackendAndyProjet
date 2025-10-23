import { IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBetDto {
  @ApiProperty({
    description: 'ID du match sur lequel parier',
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: "L'ID du match doit être un nombre" })
  @IsPositive({ message: "L'ID du match doit être positif" })
  match_id: number;

  @ApiProperty({
    description: "ID de l'équipe sur laquelle parier",
    example: 2,
    minimum: 1,
  })
  @IsNumber({}, { message: "L'ID de l'équipe doit être un nombre" })
  @IsPositive({ message: "L'ID de l'équipe doit être positif" })
  team_id: number;

  @ApiProperty({
    description: 'Montant du pari en euros',
    example: 50.0,
    minimum: 0.01,
    type: 'number',
    format: 'decimal',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Le montant doit être un nombre avec 2 décimales maximum' },
  )
  @IsPositive({ message: 'Le montant doit être positif' })
  @Min(0.01, { message: 'Le montant minimum est de 0.01€' })
  amount: number;

  @ApiProperty({
    description: 'Cote du pari',
    example: 2.5,
    minimum: 1.01,
    maximum: 100,
    type: 'number',
    format: 'decimal',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La cote doit être un nombre avec 2 décimales maximum' },
  )
  @Min(1.01, { message: 'La cote minimum est de 1.01' })
  @Max(100, { message: 'La cote maximum est de 100' })
  odds: number;
}
