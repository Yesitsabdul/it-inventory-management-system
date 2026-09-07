import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1782200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT IGNORE INTO roles (name, description) VALUES ('admin', 'Administrator with full access'), ('employee', 'Standard employee role')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM roles WHERE name IN ('admin', 'employee')`,
    );
  }
}
