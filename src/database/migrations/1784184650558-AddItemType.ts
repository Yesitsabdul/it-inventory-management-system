import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemType1784184650558 implements MigrationInterface {
    name = 'AddItemType1784184650558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`type\` \`type_id\` varchar(255) NOT NULL DEFAULT 'asset'`);
        await queryRunner.query(`CREATE TABLE \`item_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_3398f4e6d19a6c8f40ae691641\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`type_id\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`type_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_cae91bdbdc4c95176c836626335\` FOREIGN KEY (\`type_id\`) REFERENCES \`item_types\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_cae91bdbdc4c95176c836626335\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`type_id\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`type_id\` varchar(255) NOT NULL DEFAULT 'asset'`);
        await queryRunner.query(`DROP INDEX \`IDX_3398f4e6d19a6c8f40ae691641\` ON \`item_types\``);
        await queryRunner.query(`DROP TABLE \`item_types\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`type_id\` \`type\` varchar(255) NOT NULL DEFAULT 'asset'`);
    }

}
