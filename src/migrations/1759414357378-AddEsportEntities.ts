import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEsportEntities1759414357378 implements MigrationInterface {
    name = 'AddEsportEntities1759414357378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_a8b300666e2866835f805017524"`);
        await queryRunner.query(`CREATE TABLE "players" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "game_tag" character varying(50), "position" character varying, "birth_date" TIMESTAMP, "nationality" character varying(50), "avatar_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tournaments_status_enum" AS ENUM('upcoming', 'ongoing', 'finished', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "tournaments" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "game" character varying(100) NOT NULL, "prize_pool" numeric(15,2), "logo_url" character varying(255), "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "status" "public"."tournaments_status_enum" NOT NULL DEFAULT 'upcoming', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."matches_status_enum" AS ENUM('scheduled', 'live', 'finished', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "tournament_id" integer NOT NULL, "team1_id" integer NOT NULL, "team2_id" integer NOT NULL, "winner_id" integer, "scheduled_at" TIMESTAMP NOT NULL, "status" "public"."matches_status_enum" NOT NULL DEFAULT 'scheduled', "score1" integer, "score2" integer, "format" character varying(50) NOT NULL DEFAULT 'Bo3', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_players" ("team_id" integer NOT NULL, "player_id" integer NOT NULL, CONSTRAINT "PK_c7333e0ef9af57dcdd4ee59acc1" PRIMARY KEY ("team_id", "player_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1c561e231a8067e2f7a403426" ON "team_players" ("team_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_187fdfeb2ca268cf6b93e89ce1" ON "team_players" ("player_id") `);
        await queryRunner.query(`ALTER TABLE "teams" ADD "region" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "wins" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "losses" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_d0fb132a9b17b5801b916662147" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_945b7cec59479aea39db7a001ab" FOREIGN KEY ("team1_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_d43f80b79f59192843534dd6350" FOREIGN KEY ("team2_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_5d665d4ed9ae6cf089ece227754" FOREIGN KEY ("winner_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_a8b300666e2866835f805017524" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_players" ADD CONSTRAINT "FK_d1c561e231a8067e2f7a403426c" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_players" ADD CONSTRAINT "FK_187fdfeb2ca268cf6b93e89ce12" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_players" DROP CONSTRAINT "FK_187fdfeb2ca268cf6b93e89ce12"`);
        await queryRunner.query(`ALTER TABLE "team_players" DROP CONSTRAINT "FK_d1c561e231a8067e2f7a403426c"`);
        await queryRunner.query(`ALTER TABLE "bets" DROP CONSTRAINT "FK_a8b300666e2866835f805017524"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_5d665d4ed9ae6cf089ece227754"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_d43f80b79f59192843534dd6350"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_945b7cec59479aea39db7a001ab"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_d0fb132a9b17b5801b916662147"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "losses"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "wins"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "region"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_187fdfeb2ca268cf6b93e89ce1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1c561e231a8067e2f7a403426"`);
        await queryRunner.query(`DROP TABLE "team_players"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TYPE "public"."matches_status_enum"`);
        await queryRunner.query(`DROP TABLE "tournaments"`);
        await queryRunner.query(`DROP TYPE "public"."tournaments_status_enum"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`ALTER TABLE "bets" ADD CONSTRAINT "FK_a8b300666e2866835f805017524" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
