import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1759410697009 implements MigrationInterface {
    name = 'CreateAllTables1759410697009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "logo_url" character varying(255), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."match_status_enum" AS ENUM('pending', 'finish', 'in progress')`);
        await queryRunner.query(`CREATE TABLE "match" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."match_status_enum" NOT NULL DEFAULT 'pending', "score_a" integer, "score_b" integer, "winner_id" integer, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bets_status_enum" AS ENUM('pending', 'win', 'lose')`);
        await queryRunner.query(`CREATE TABLE "bets" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "status" "public"."bets_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "match_id" integer NOT NULL, "team_id" integer NOT NULL, CONSTRAINT "PK_7ca91a6a39623bd5c21722bcedd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('deposit', 'bet', 'win', 'withdraw', 'loss')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "balance_after" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_tokens" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "refresh_token" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_599f0879e9996186642d8626e6b" UNIQUE ("refresh_token"), CONSTRAINT "PK_41e9ddfbb32da18c4e85e45c2fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_383e55425736e9b0286e198ce3d" FOREIGN KEY ("winner_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_8e3c745e288eea6d3c9475550e2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_a8b300666e2866835f805017524" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_78ab63d8a07395b72e0e1e671ef" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_tokens" ADD CONSTRAINT "FK_9691367d446cd8b18f462c191b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_tokens" DROP CONSTRAINT "FK_9691367d446cd8b18f462c191b3"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_78ab63d8a07395b72e0e1e671ef"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_a8b300666e2866835f805017524"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_8e3c745e288eea6d3c9475550e2"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_383e55425736e9b0286e198ce3d"`);
        await queryRunner.query(`DROP TABLE "auth_tokens"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "bets"`);
        await queryRunner.query(`DROP TYPE "public"."bets_status_enum"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TYPE "public"."match_status_enum"`);
        await queryRunner.query(`DROP TABLE "teams"`);
    }

}
