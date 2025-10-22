import { IsNumber, Min, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BalanceOperation {
  ADD = 'add',
  SUBTRACT = 'subtract',
  SET = 'set',
}

export class UpdateBalanceDto {
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Montant invalide' })
  @Min(0.01, { message: 'Montant minimum : 0.01€' })
  amount: number;

  @ApiProperty({ enum: BalanceOperation })
  @IsEnum(BalanceOperation, { message: 'Opération invalide' })
  operation: BalanceOperation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
