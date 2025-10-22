import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class CreateBetDto {
  @IsNumber({}, { message: "L'ID du match doit être un nombre" })
  @IsPositive({ message: "L'ID du match doit être positif" })
  match_id: number;

  @IsNumber({}, { message: "L'ID de l'équipe doit être un nombre" })
  @IsPositive({ message: "L'ID de l'équipe doit être positif" })
  team_id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Le montant doit être un nombre avec 2 décimales maximum' },
  )
  @IsPositive({ message: 'Le montant doit être positif' })
  @Min(0.01, { message: 'Le montant minimum est de 0.01€' })
  amount: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La cote doit être un nombre avec 2 décimales maximum' },
  )
  @Min(1.01, { message: 'La cote minimum est de 1.01' })
  @Max(100, { message: 'La cote maximum est de 100' })
  odds: number;
}
