import { OrderService as MedusaOrderService } from '@medusajs/medusa';
import { CreateOrderInput } from '@medusajs/medusa/dist/types/orders';
import { Lifetime } from 'awilix';
import { User } from 'src/models/user';

type OrderSelector = {
  store_id?: string;
} & CreateOrderInput;

class OrderService extends MedusaOrderService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInUser_: User | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when the backend first runs
    }
  }

  // async list(
  //   selector: Selector<Order>,
  //   config?: FindConfig<Order>
  // ): Promise<Order[]> {
  //   if (!selector.store_id && this.loggedInUser_?.store_id) {
  //     selector.store_id = this.loggedInUser_.store_id;
  //   }

  //   config.select?.push('store_id');

  //   // config.relations?.push('store');
  //   config.relations.push('children', 'parent', 'store');

  //   return await super.list(selector, config);
  // }

  // async listAndCount(
  //   selector: QuerySelector<Order>,
  //   config?: FindConfig<Order>
  // ): Promise<[Order[], number]> {
  //   if (!selector.store_id && this.loggedInUser_?.store_id) {
  //     selector.store_id = this.loggedInUser_.store_id;
  //   }

  //   config.select?.push('store_id');

  //   // config.relations?.push('store');
  //   config.relations.push('children', 'parent', 'store');

  //   return await super.listAndCount(selector, config);
  // }

  // async retrieve(orderId: string, config?: FindConfig<Order>): Promise<Order> {
  //   config.relations = [
  //     ...(config.relations || []),
  //     'children',
  //     'parent',
  //     'store',
  //   ];

  //   const order = await super.retrieve(orderId, config);

  //   if (
  //     order.store?.id &&
  //     this.loggedInUser_?.store_id &&
  //     order.store.id !== this.loggedInUser_.store_id
  //   ) {
  //     // Throw error if you don't want an order to be accessible to other stores
  //     throw new Error('Order does not exist in store.');
  //   }

  //   return order;
  // }
}

export default OrderService;
