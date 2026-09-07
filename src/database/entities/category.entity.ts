import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Model } from './model.entity';
import { ItemType } from './item-type.entity';

@Entity('categories')
export class Category extends AppBaseEntity {
  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => ItemType, (type) => type.categories, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'type_id' })
  type!: ItemType;

  @OneToMany(() => Model, (model) => model.category)
  models!: Model[];
}