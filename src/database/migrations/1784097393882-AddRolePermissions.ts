import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolePermissions1784097393882 implements MigrationInterface {
    name = 'AddRolePermissions1784097393882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles\` ADD \`permissions\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`permissions\``);
    }

}
