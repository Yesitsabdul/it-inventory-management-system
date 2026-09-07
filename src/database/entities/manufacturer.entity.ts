import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Model } from './model.entity';

@Entity('manufacturers')
export class Manufacturer extends AppBaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  support_url!: string;

  @Column({ nullable: true })
  support_email!: string;

  @OneToMany(() => Model, (model) => model.manufacturer)
  models!: Model[];
}