import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends AppBaseEntity {
  @Column({ unique: true })
  name!: string; // 'admin' or 'employee'

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'json', nullable: true })
  permissions!: any;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}