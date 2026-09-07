import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1782200200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    await queryRunner.query(
      `INSERT INTO users (first_name, last_name, email, password, employee_number, is_active, role_id)
       VALUES ('Admin', 'User', 'admin@example.com', ?, 'ADM001', 1,
         (SELECT id FROM roles WHERE name = 'admin' LIMIT 1))`,
      [passwordHash],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email = 'admin@example.com'`,
    );
  }
}
