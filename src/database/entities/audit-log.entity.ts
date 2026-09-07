import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog extends AppBaseEntity {
  @Column()
  action!: string;

  @Column({ nullable: true })
  entity_type!: string;

  @Column({ nullable: true })
  entity_id!: number;

  @Column({ type: 'text', nullable: true })
  details!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
