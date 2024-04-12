import { Store as MedusaStore } from '@medusajs/medusa';
import { Entity, JoinColumn, OneToMany, ManyToMany, Column } from 'typeorm';

import { Product } from './product';
import { Role } from './role';
import { User } from './user';

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user?.store)
  members?: User[];

  
  @ManyToMany(() => Product, product => product.store)
  products: Product[];

  @OneToMany(() => Role, (role) => role.store)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  roles: Role[];

  @Column({ type: 'varchar', unique: true, nullable: true })
  domain: string;

  // @Column({ type: 'varchar', nullable: true })
  // banner_image: string;
}
