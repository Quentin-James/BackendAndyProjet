import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Mot de passe requis' })
  password: string;
}
