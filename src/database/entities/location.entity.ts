import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Asset } from './asset.entity';
import { Department } from './department.entity';

@Entity('locations')
export class Location extends AppBaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  country!: string;

  @OneToMany(() => Department, (department) => department.location)
  departments!: Department[];

  @OneToMany(() => Asset, (asset) => asset.location)
  assets!: Asset[];
}