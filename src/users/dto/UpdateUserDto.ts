import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entities';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  @MaxLength(50, {
    message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
  })
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email invalide' })
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Balance invalide' })
  @Min(0, { message: 'La balance ne peut pas être négative' })
  balance?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role?: UserRole;
}
