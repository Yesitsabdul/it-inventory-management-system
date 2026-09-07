import { Entity, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Role } from './role.entity';
import { Department } from './department.entity';
import { AssetAssignment } from './asset-assignment.entity';
import { AuditLog } from './audit-log.entity';

@Entity('users')
export class User extends AppBaseEntity {
  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  private originalPassword: string | undefined;

  @AfterLoad()
  loadOriginalPassword() {
    this.originalPassword = this.password;
  }

  @BeforeInsert()
  async hashPasswordOnCreate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    if (this.password && this.password !== this.originalPassword) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column({ unique: true, nullable: true })
  employee_number!: string;

  @Column({ default: true })
  is_active!: boolean;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => Department, (department) => department.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department!: Department;

  @OneToMany(() => AssetAssignment, (assignment) => assignment.assigned_to)
  assignments!: AssetAssignment[];

  @OneToMany(() => AuditLog, (log) => log.user)
  audit_logs!: AuditLog[];
}