import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail({}, { message: 'Nouvel email invalide' })
  newEmail: string;

  @IsString()
  @MinLength(1, { message: 'Mot de passe requis pour confirmer le changement' })
  password: string;
}
