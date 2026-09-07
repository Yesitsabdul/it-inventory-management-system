import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export abstract class AppBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at!: Date | null;
  
  @Expose()
  referenceCount?: number;
}