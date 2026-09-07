import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/base/base.entity';
import { Manufacturer } from './manufacturer.entity';
import { Category } from './category.entity';
import { Asset } from './asset.entity';
@Entity('models')
export class Model extends AppBaseEntity {
  @Column()
  name!: string;
  @Column({ nullable: true })
  model_number!: string;
  @Column({ unique: true })
  unique_id!: string;
  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.models, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'manufacturer_id' })
manufacturer!: Manufacturer;
@ManyToOne(() => Category, (category) => category.models, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'category_id' })
category!: Category;
@OneToMany(() => Asset, (asset) => asset.model)
assets!: Asset[];
}