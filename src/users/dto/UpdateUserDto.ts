import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../entities/user.entities';
export class UpdateUserDto{
   @IsOptional()
   @IsString()
   @MinLength(3,{
    message: "le nom d'utilisateur doit contenir au mois 3 caractères"
   })
    
}