import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Asset } from './asset.entity';
import { MaintenanceLog } from './maintenance-log.entity';

@Entity('vendors')
export class Vendor extends AppBaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  contact_name!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @OneToMany(() => Asset, (asset) => asset.vendor)
  assets!: Asset[];

  @OneToMany(() => MaintenanceLog, (log) => log.vendor)
  maintenance_logs!: MaintenanceLog[];
}