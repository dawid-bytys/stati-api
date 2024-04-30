import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714500914783 implements MigrationInterface {
    name = 'Migration1714500914783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "friendUri" character varying NOT NULL, "timestampMs" bigint NOT NULL, "userId" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "deviceUniqueId" character varying NOT NULL, "userId" integer, CONSTRAINT "UQ_6c164751afaaedb907c4bd33178" UNIQUE ("deviceUniqueId", "userId"), CONSTRAINT "PK_2f7d7b15525f17c7123e6422d28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spotify_auth" ("id" SERIAL NOT NULL, "spdcCookie" character varying NOT NULL, "accessToken" character varying NOT NULL, "accessTokenExpirationTimestampMs" bigint NOT NULL, "userId" integer, CONSTRAINT "UQ_98e9ca233cbabf246d13168e1ae" UNIQUE ("spdcCookie"), CONSTRAINT "UQ_509ccf5a2f9c236a1277ce99318" UNIQUE ("accessToken"), CONSTRAINT "REL_ab65b10dfc09035dfead16c2e6" UNIQUE ("userId"), CONSTRAINT "PK_f2ff16d1bd47555f00a8564fb8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_tokens" ADD CONSTRAINT "FK_44a4ff581335d5aafa04223caa1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spotify_auth" ADD CONSTRAINT "FK_ab65b10dfc09035dfead16c2e64" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spotify_auth" DROP CONSTRAINT "FK_ab65b10dfc09035dfead16c2e64"`);
        await queryRunner.query(`ALTER TABLE "notification_tokens" DROP CONSTRAINT "FK_44a4ff581335d5aafa04223caa1"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71"`);
        await queryRunner.query(`DROP TABLE "spotify_auth"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "notification_tokens"`);
        await queryRunner.query(`DROP TABLE "activities"`);
    }

}
