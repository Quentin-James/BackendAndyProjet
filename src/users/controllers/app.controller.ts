import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '../services/UserService';
import { UserAuthService } from '../services/UserAuthService';
import { UserProfileService } from '../services/UserProfileService';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserResponseDto,
  UserProfileDto,
} from '../dto';
import { ChangeEmailDto } from '../dto/ChangeEmail.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email ou username déjà utilisé' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userAuthService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userAuthService.login(loginUserDto);
  }

  @Get('leaderboard/top')
  @ApiOperation({ summary: 'Obtenir le classement des meilleurs joueurs' })
  @ApiResponse({
    status: 200,
    description: 'Classement',
    type: [UserProfileDto],
  })
  async getLeaderboard() {
    return await this.userProfileService.getLeaderboard(10);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
    type: [UserResponseDto],
  })
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(+id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const { password_hash, ...userResponse } = user;
    return userResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour',
    type: UserResponseDto,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  async deleteUser(@Param('id') id: string) {
    await this.userService.delete(+id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  @Get(':id/profile')
  @ApiOperation({ summary: "Obtenir le profil public d'un utilisateur" })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur',
    type: UserProfileDto,
  })
  async getPublicProfile(@Param('id') id: string) {
    return await this.userProfileService.getPublicProfile(+id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: "Obtenir les statistiques d'un utilisateur" })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Statistiques utilisateur' })
  async getUserStats(@Param('id') id: string) {
    return await this.userProfileService.getUserStats(+id);
  }

  @Get(':id/profile-with-stats')
  @ApiOperation({
    summary: "Obtenir le profil avec statistiques d'un utilisateur",
  })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Profil avec statistiques',
  })
  async getProfileWithStats(@Param('id') id: string) {
    return await this.userProfileService.getProfileWithStats(+id);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: 'Changer le mot de passe' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Mot de passe changé' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.userAuthService.changePassword(+id, changePasswordDto);
    return { message: 'Mot de passe changé avec succès' };
  }

  @Post(':id/change-email')
  @ApiOperation({ summary: "Changer l'email" })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiBody({ type: ChangeEmailDto })
  @ApiResponse({
    status: 200,
    description: 'Email changé',
    type: UserResponseDto,
  })
  async changeEmail(
    @Param('id') id: string,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    return await this.userAuthService.changeEmail(+id, changeEmailDto);
  }
}
