import { MigrationInterface, QueryRunner } from "typeorm";
export class InitialSchema1782106813126 implements MigrationInterface {
    name = 'InitialSchema1782106813126'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`locations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, \`city\` varchar(255) NULL, \`country\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`departments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`location_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`employee_number\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`role_id\` int NULL, \`department_id\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_4541de56cf6586feb53ff762ea\` (\`employee_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`status_labels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'deployable', \`color\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`contact_name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`phone\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`manufacturers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`support_url\` varchar(255) NULL, \`support_email\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'asset', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`models\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`model_number\` varchar(255) NULL, \`unique_id\` varchar(255) NOT NULL, \`manufacturer_id\` int NULL, \`category_id\` int NULL, UNIQUE INDEX \`IDX_2a7d333a6a5f2e10d77b0c08a6\` (\`unique_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`assets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`asset_tag\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`serial_number\` varchar(255) NULL, \`purchase_cost\` decimal(10,2) NULL, \`purchase_date\` date NULL, \`warranty_expiry\` date NULL, \`notes\` text NULL, \`model_id\` int NULL, \`status_label_id\` int NULL, \`location_id\` int NULL, \`vendor_id\` int NULL, UNIQUE INDEX \`IDX_490daec7711d8e8bedd6a5a7ca\` (\`asset_tag\`), UNIQUE INDEX \`IDX_9da03d06e2af9f607159e88426\` (\`serial_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`maintenance_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'maintenance', \`start_date\` date NULL, \`completion_date\` date NULL, \`cost\` decimal(10,2) NULL, \`notes\` text NULL, \`asset_id\` int NULL, \`performed_by_id\` int NULL, \`vendor_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`components\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`serial_number\` varchar(255) NULL, \`quantity\` int NOT NULL DEFAULT '0', \`min_quantity\` int NOT NULL DEFAULT '0', \`purchase_cost\` decimal(10,2) NULL, \`notes\` text NULL, \`category_id\` int NULL, \`manufacturer_id\` int NULL, \`location_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`asset_assignments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`action_type\` varchar(255) NOT NULL DEFAULT 'checkout', \`checkout_at\` timestamp NULL, \`checkin_at\` timestamp NULL, \`expected_checkin\` date NULL, \`notes\` text NULL, \`asset_id\` int NULL, \`assigned_to_id\` int NULL, \`assigned_by_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`accessories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`quantity\` int NOT NULL DEFAULT '0', \`min_quantity\` int NOT NULL DEFAULT '0', \`purchase_cost\` decimal(10,2) NULL, \`notes\` text NULL, \`category_id\` int NULL, \`manufacturer_id\` int NULL, \`location_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`departments\` ADD CONSTRAINT \`FK_eba67cbcdb7ed6949c14707fde7\` FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_0921d1972cf861d568f5271cd85\` FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`models\` ADD CONSTRAINT \`FK_0f38d27d487c72e023d7308a69f\` FOREIGN KEY (\`manufacturer_id\`) REFERENCES \`manufacturers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`models\` ADD CONSTRAINT \`FK_a1479cb87645bb23f589965cc37\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assets\` ADD CONSTRAINT \`FK_df4f64499669a881bb0b5f9d987\` FOREIGN KEY (\`model_id\`) REFERENCES \`models\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assets\` ADD CONSTRAINT \`FK_52e3d33440f7d2c393dcfd4bd62\` FOREIGN KEY (\`status_label_id\`) REFERENCES \`status_labels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assets\` ADD CONSTRAINT \`FK_916f79b60e63293b23def86da6d\` FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assets\` ADD CONSTRAINT \`FK_a4d58da8b1bdb73a0946964e6cc\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`maintenance_logs\` ADD CONSTRAINT \`FK_58fd098e2d585411d4b1dee7406\` FOREIGN KEY (\`asset_id\`) REFERENCES \`assets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`maintenance_logs\` ADD CONSTRAINT \`FK_1385657e3c8bf6b545654751571\` FOREIGN KEY (\`performed_by_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`maintenance_logs\` ADD CONSTRAINT \`FK_3041c7ace7dc4b72ee8353512e1\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`components\` ADD CONSTRAINT \`FK_5b1fd7cd2e79ca087fa11298c7f\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`components\` ADD CONSTRAINT \`FK_85debdfa0e924776ad9bbcc90ca\` FOREIGN KEY (\`manufacturer_id\`) REFERENCES \`manufacturers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`components\` ADD CONSTRAINT \`FK_22a469481fee06d551065a5ec90\` FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`asset_assignments\` ADD CONSTRAINT \`FK_3b81c0dcc6a4264cbd0b548fa7b\` FOREIGN KEY (\`asset_id\`) REFERENCES \`assets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`asset_assignments\` ADD CONSTRAINT \`FK_2096ee32fb168a7f97a7781f76e\` FOREIGN KEY (\`assigned_to_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`asset_assignments\` ADD CONSTRAINT \`FK_d5df8705fd4baacdf0bd420eda8\` FOREIGN KEY (\`assigned_by_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accessories\` ADD CONSTRAINT \`FK_2538ab10c437304b4398cd41133\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accessories\` ADD CONSTRAINT \`FK_7b330f713315419c9a46b8484ce\` FOREIGN KEY (\`manufacturer_id\`) REFERENCES \`manufacturers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accessories\` ADD CONSTRAINT \`FK_1baf84796c39c08c54cea87f8ee\` FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accessories\` DROP FOREIGN KEY \`FK_1baf84796c39c08c54cea87f8ee\``);
        await queryRunner.query(`ALTER TABLE \`accessories\` DROP FOREIGN KEY \`FK_7b330f713315419c9a46b8484ce\``);
        await queryRunner.query(`ALTER TABLE \`accessories\` DROP FOREIGN KEY \`FK_2538ab10c437304b4398cd41133\``);
        await queryRunner.query(`ALTER TABLE \`asset_assignments\` DROP FOREIGN KEY \`FK_d5df8705fd4baacdf0bd420eda8\``);
        await queryRunner.query(`ALTER TABLE \`asset_assignments\` DROP FOREIGN KEY \`FK_2096ee32fb168a7f97a7781f76e\``);
        await queryRunner.query(`ALTER TABLE \`asset_assignments\` DROP FOREIGN KEY \`FK_3b81c0dcc6a4264cbd0b548fa7b\``);
        await queryRunner.query(`ALTER TABLE \`components\` DROP FOREIGN KEY \`FK_22a469481fee06d551065a5ec90\``);
        await queryRunner.query(`ALTER TABLE \`components\` DROP FOREIGN KEY \`FK_85debdfa0e924776ad9bbcc90ca\``);
        await queryRunner.query(`ALTER TABLE \`components\` DROP FOREIGN KEY \`FK_5b1fd7cd2e79ca087fa11298c7f\``);
        await queryRunner.query(`ALTER TABLE \`maintenance_logs\` DROP FOREIGN KEY \`FK_3041c7ace7dc4b72ee8353512e1\``);
        await queryRunner.query(`ALTER TABLE \`maintenance_logs\` DROP FOREIGN KEY \`FK_1385657e3c8bf6b545654751571\``);
        await queryRunner.query(`ALTER TABLE \`maintenance_logs\` DROP FOREIGN KEY \`FK_58fd098e2d585411d4b1dee7406\``);
        await queryRunner.query(`ALTER TABLE \`assets\` DROP FOREIGN KEY \`FK_a4d58da8b1bdb73a0946964e6cc\``);
        await queryRunner.query(`ALTER TABLE \`assets\` DROP FOREIGN KEY \`FK_916f79b60e63293b23def86da6d\``);
        await queryRunner.query(`ALTER TABLE \`assets\` DROP FOREIGN KEY \`FK_52e3d33440f7d2c393dcfd4bd62\``);
        await queryRunner.query(`ALTER TABLE \`assets\` DROP FOREIGN KEY \`FK_df4f64499669a881bb0b5f9d987\``);
        await queryRunner.query(`ALTER TABLE \`models\` DROP FOREIGN KEY \`FK_a1479cb87645bb23f589965cc37\``);
        await queryRunner.query(`ALTER TABLE \`models\` DROP FOREIGN KEY \`FK_0f38d27d487c72e023d7308a69f\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_0921d1972cf861d568f5271cd85\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`ALTER TABLE \`departments\` DROP FOREIGN KEY \`FK_eba67cbcdb7ed6949c14707fde7\``);
        await queryRunner.query(`DROP TABLE \`accessories\``);
        await queryRunner.query(`DROP TABLE \`asset_assignments\``);
        await queryRunner.query(`DROP TABLE \`components\``);
        await queryRunner.query(`DROP TABLE \`maintenance_logs\``);
        await queryRunner.query(`DROP INDEX \`IDX_9da03d06e2af9f607159e88426\` ON \`assets\``);
        await queryRunner.query(`DROP INDEX \`IDX_490daec7711d8e8bedd6a5a7ca\` ON \`assets\``);
        await queryRunner.query(`DROP TABLE \`assets\``);
        await queryRunner.query(`DROP INDEX \`IDX_2a7d333a6a5f2e10d77b0c08a6\` ON \`models\``);
        await queryRunner.query(`DROP TABLE \`models\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`manufacturers\``);
        await queryRunner.query(`DROP TABLE \`vendors\``);
        await queryRunner.query(`DROP TABLE \`status_labels\``);
        await queryRunner.query(`DROP INDEX \`IDX_4541de56cf6586feb53ff762ea\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`departments\``);
        await queryRunner.query(`DROP TABLE \`locations\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
