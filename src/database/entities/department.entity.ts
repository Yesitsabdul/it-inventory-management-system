import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Location } from './location.entity';
import { User } from './user.entity';

@Entity('departments')
export class Department extends AppBaseEntity {
  @Column()
  name!: string;

  @ManyToOne(() => Location, (location) => location.departments, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  @OneToMany(() => User, (user) => user.department)
  users!: User[];
}