import { Store as MedusaStore } from '@medusajs/medusa';
import { Entity, JoinColumn, OneToMany, ManyToMany, BeforeInsert } from 'typeorm';
import { Order } from './order';
import { Product } from './product';
import { Role } from './role';
import { User } from './user';

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user?.store)
  members?: User[];

  
  @ManyToMany(() => Product, product => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order?.store)
  orders?: Order[];

  @OneToMany(() => Role, (role) => role.store)
  @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
  roles: Role[];
  
}
