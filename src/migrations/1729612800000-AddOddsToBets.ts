import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOddsToBets1729612800000 implements MigrationInterface {
  name = 'AddOddsToBets1729612800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la colonne odds existe déjà
    const table = await queryRunner.getTable('bets');
    const oddsColumn = table?.findColumnByName('odds');
    const potentialWinColumn = table?.findColumnByName('potential_win');

    // Ajouter la colonne odds si elle n'existe pas
    if (!oddsColumn) {
      await queryRunner.addColumn(
        'bets',
        new TableColumn({
          name: 'odds',
          type: 'decimal',
          precision: 10,
          scale: 2,
          isNullable: false,
          default: 2.0,
        }),
      );
      console.log('Column "odds" added to "bets" table');
    }

    // Ajouter la colonne potential_win si elle n'existe pas
    if (!potentialWinColumn) {
      await queryRunner.addColumn(
        'bets',
        new TableColumn({
          name: 'potential_win',
          type: 'decimal',
          precision: 10,
          scale: 2,
          isNullable: false,
          default: 0,
        }),
      );
      console.log('Column "potential_win" added to "bets" table');
    }

    // Mettre à jour les paris existants pour calculer potential_win
    await queryRunner.query(`
      UPDATE bets 
      SET potential_win = amount * odds 
      WHERE potential_win = 0 OR potential_win IS NULL
    `);
    console.log('Existing bets updated with potential_win calculations');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les colonnes dans l'ordre inverse
    await queryRunner.dropColumn('bets', 'potential_win');
    console.log('Column "potential_win" dropped from "bets" table');

    await queryRunner.dropColumn('bets', 'odds');
    console.log('Column "odds" dropped from "bets" table');
  }
}
