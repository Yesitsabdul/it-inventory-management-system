import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssetQuantity1783491249831 implements MigrationInterface {
    name = 'AddAssetQuantity1783491249831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assets\` ADD \`quantity\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assets\` DROP COLUMN \`quantity\``);
    }

}
