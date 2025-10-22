import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entities';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  @MaxLength(50, {
    message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
  })
  username: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
