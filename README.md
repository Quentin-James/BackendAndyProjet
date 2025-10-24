# Esport Bet API - Documentation

## 🎯 Décorateurs spécifiques utilisés

| Décorateur      | Usage                       | Documentation                                                                              |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| `@IsString()`   | Valide que c'est une string | [Documentation](https://github.com/typestack/class-validator#common-validation-decorators) |
| `@IsEmail()`    | Valide le format email      | [Documentation](https://github.com/typestack/class-validator#common-validation-decorators) |
| `@MinLength()`  | Longueur minimum            | [Documentation](https://github.com/typestack/class-validator#string-validation-decorators) |
| `@MaxLength()`  | Longueur maximum            | [Documentation](https://github.com/typestack/class-validator#string-validation-decorators) |
| `@IsOptional()` | Propriété optionnelle       | [Documentation](https://github.com/typestack/class-validator#conditional-validation)       |
| `@IsEnum()`     | Valide enum TypeScript      | [Documentation](https://github.com/typestack/class-validator#other-decorators)             |
| `@IsNumber()`   | Valide les nombres          | [Documentation](https://github.com/typestack/class-validator#number-validation-decorators) |
| `@Min()`        | Valeur minimum              | [Documentation](https://github.com/typestack/class-validator#number-validation-decorators) |
| `@Expose()`     | Expose la propriété         | [Documentation](https://github.com/typestack/class-transformer#exposing-properties)        |
| `@Exclude()`    | Exclut la propriété         | [Documentation](https://github.com/typestack/class-transformer#exposing-properties)        |

## 📖 Guides utiles

### Configuration NestJS

- **Validation globale** : [Using the built-in ValidationPipe](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe)
- **Transform options** : [Transform payload objects](https://docs.nestjs.com/techniques/validation#transform-payload-objects)

### Exemples avancés

- **Custom validators** : [Custom validation classes](https://github.com/typestack/class-validator#custom-validation-classes)
- **Nested validation** : [Validating nested objects](https://github.com/typestack/class-validator#validating-nested-objects)
- **Conditional validation** : [Conditional validation](https://github.com/typestack/class-validator#conditional-validation)

  const { password_hash, ...userResponse } = user;
  return {
  ...userResponse,
  totalBets: user.bets?.length || 0,
  totalTransactions: user.transactions?.length || 0,
  };

  ## exclus password_hash de user response dans un premier temps

  ## puis fusionne user Response sans password avec les autres propriétés

  ## ||0 si la valeur est null alors renvoi 0

## Asyncronysme pour vérifier l'unicité(pas de username déjà utilisé)

async create(createUserData: ICreateUser): Promise<IUserResponse> {
// Vérifier l'unicité
const existingUser = await this.userRepository.findOne({
where: [
{ email: createUserData.email },
{ username: createUserData.username }
]
});

    if (existingUser) {
      throw new ConflictException('Email ou nom d\'utilisateur déjà utilisé');
    }

    const user = this.userRepository.create(createUserData);
    const savedUser = await this.userRepository.save(user);

    const { password_hash, ...userResponse } = savedUser;
    return userResponse;

}

## Utilité du Passport pour JwtStrategy

#### Dans NestJS, le JWT (JSON Web Token) est utilisé pour sécuriser les routes via l’authentification. On l’implémente souvent avec Passport et le module @nestjs/jwt. Lorsqu’un utilisateur se connecte, le serveur génère un token signé contenant ses informations (payload), que le client stocke. Les guards (JwtAuthGuard) vérifient ensuite ce token sur chaque requête pour autoriser l’accès aux routes protégées, permettant un contrôle simple et sécurisé des accès.

$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local

## Config Passport

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor() {
super({
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
ignoreExpiration: false,
secretOrKey: jwtConstants.secret,
});
}

async validate(payload: any) {
return { userId: payload.sub, username: payload.username };
}
}

## resynchroniser les id sql si besoin

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

## Pourquoi une cote implicite ?

La cote implicite est la probabilité que l’événement se produise selon le bookmaker.
Autrement dit, elle te dit la chance estimée qu’une équipe gagne (ou qu’un événement se produise) d’après la cote proposée.
