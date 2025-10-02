import { IsNumber, Min, IsEnum, IsOptional, IsString } from 'class-validator';

export enum BalanceOperation {
  ADD = 'add',
  SUBTRACT = 'subtract',
  SET = 'set',
}

export class UpdateBalanceDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Montant invalide' })
  @Min(0.01, { message: 'Montant minimum : 0.01€' })
  amount: number;

  @IsEnum(BalanceOperation, { message: 'Opération invalide' })
  operation: BalanceOperation;

  @IsOptional()
  @IsString()
  reason?: string;
}
