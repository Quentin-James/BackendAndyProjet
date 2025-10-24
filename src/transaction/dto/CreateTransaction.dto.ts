import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsPositive } from 'class-validator';
import { TransactionType } from '../../entities/transaction.entities';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Type de transaction',
    example: TransactionType.DEPOSIT,
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Montant de la transaction',
    example: 100.0,
    type: 'number',
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Solde utilisateur après transaction',
    example: 250.0,
    type: 'number',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  balance_after: number;

  @ApiProperty({
    description: "ID de l'utilisateur concerné",
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  user_id: number;
}
