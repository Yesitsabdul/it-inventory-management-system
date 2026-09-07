import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Model } from './model.entity';
import { Location } from './location.entity';
import { Vendor } from './vendor.entity';
import { AssetAssignment } from './asset-assignment.entity';
import { MaintenanceLog } from './maintenance-log.entity';

@Entity('assets')
export class Asset extends AppBaseEntity {
  @Column({ unique: true })
  asset_tag!: string; // e.g. "ASSET-00042"

  @Column({ nullable: true })
  name!: string;

  @Column({ unique: true, nullable: true })
  serial_number!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchase_cost!: number;

  @Column({ type: 'date', nullable: true })
  purchase_date!: Date;

  @Column({ type: 'date', nullable: true })
  warranty_expiry!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @ManyToOne(() => Model, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_id' })
  model!: Model;


  @ManyToOne(() => Location, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor!: Vendor;

  @OneToMany(() => AssetAssignment, (assignment) => assignment.asset)
  assignments!: AssetAssignment[];

  @OneToMany(() => MaintenanceLog, (log) => log.asset)
  maintenance_logs!: MaintenanceLog[];
}