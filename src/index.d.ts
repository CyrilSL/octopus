export declare module '@medusajs/medusa/dist/models/store' {
  declare interface Store {
    members?: User[];
    products?: Product[];
    orders?: Order[];
    roles: Role[];
  }
}

export declare module '@medusajs/medusa/dist/models/user' {
  declare interface User {
    store_id?: string;
    store?: Store;
    role_id: string | null;
    teamRole: Role | null;
  }
}

export declare module '@medusajs/medusa/dist/models/product' {
  declare interface Product {
    store_id?: string;
    store?: Store;
  }
}

export declare module '@medusajs/medusa/dist/models/order' {
  declare interface Order {
    store_id?: string;
    order_parent_id: string;
    store?: Store;
    parent: Order;
    children: Order[];
  }
}
