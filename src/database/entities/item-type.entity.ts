import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Category } from './category.entity';

@Entity('item_types')
export class ItemType extends AppBaseEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Category, (category) => category.type)
  categories!: Category[];
}
