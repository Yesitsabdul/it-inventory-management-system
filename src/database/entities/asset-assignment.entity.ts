import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Asset } from './asset.entity';
import { User } from './user.entity';
@Entity('asset_assignments')
export class AssetAssignment extends AppBaseEntity {
  @Column({ default: 'checkout' })
  action_type!: string;
  @Column({ type: 'timestamp', nullable: true })
  checkout_at!: Date;
  @Column({ type: 'timestamp', nullable: true })
  checkin_at!: Date;
  @Column({ type: 'date', nullable: true })
  expected_checkin!: Date;
  @Column({ type: 'text', nullable: true })
  notes!: string;
  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assigned_to_id' })
  assigned_to!: User; // the employee receiving the asset (record-only, no login)
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'assigned_by_id' })
  assigned_by!: User; // the admin performing the action
}