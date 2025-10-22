import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Nouvel email invalide' })
  newEmail: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Mot de passe requis pour confirmer le changement' })
  password: string;
}
