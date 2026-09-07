import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Asset } from './asset.entity';
import { User } from './user.entity';
import { Vendor } from './vendor.entity';

@Entity('maintenance_logs')
export class MaintenanceLog extends AppBaseEntity {
  @Column()
  title!: string;

  @Column({ default: 'maintenance' })
  type!: string; // 'maintenance' | 'repair' | 'upgrade'

  @Column({ type: 'date', nullable: true })
  start_date!: Date;

  @Column({ type: 'date', nullable: true })
  completion_date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost!: number;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'performed_by_id' })
  performed_by!: User; // technician

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor!: Vendor;
}