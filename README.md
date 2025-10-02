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
