import { Lifetime } from "awilix";
import { OrderService as MedusaOrderService } from "@medusajs/medusa";
import OrderRepository from "../repositories/order";
import StoreRepository from "../repositories/store";
import { Order } from "../models/order"

class OrderService extends MedusaOrderService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly orderRepository_: typeof OrderRepository;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.orderRepository_ = container.orderRepository;
    this.storeRepository_ = container.storeRepository;
  }

  async link(orderId: string, storeId: string): Promise<void> {
    const order = await this.orderRepository_.findOne({
      where: { id: orderId },
      relations: ["store"],
    });
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    if (order.store?.id === storeId) {
      return;
    }

    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    const store = await storeRepo.findOne({ where: { id: storeId } });
    if (!store) {
      throw new Error(`Store with id ${storeId} not found`);
    }

    order.store = store;
    await this.orderRepository_.save(order);
  }

  async getStoreOrders(storeId: string): Promise<Order[]> {
    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    const store = await storeRepo.findOne({ where: { id: storeId } });
    if (!store) {
      throw new Error(`Store with id ${storeId} not found`);
    }

    const orders = await this.orderRepository_.find({
      where: { store: { id: storeId } },
      relations: ["store"],
    });
    return orders;
  }
}

export default OrderService;