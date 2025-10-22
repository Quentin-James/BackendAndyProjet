import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOddsToBets1700000000000 implements MigrationInterface {
  name = 'AddOddsToBets1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bets" ADD "odds" numeric(5,2) NOT NULL DEFAULT 2.00`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" ADD "potential_win" numeric(10,2) NOT NULL DEFAULT 0`,
    );

    // Calculer potential_win pour les paris existants (odds par défaut = 2.00)
    await queryRunner.query(
      `UPDATE "bets" SET "potential_win" = "amount" * "odds" WHERE "potential_win" = 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "potential_win"`);
    await queryRunner.query(`ALTER TABLE "bets" DROP COLUMN "odds"`);
  }
}
