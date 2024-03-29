import {
    SubscriberConfig,
    SubscriberArgs,
  } from "@medusajs/medusa"
  
  import OrderService from '../services/order'
  import StoreService from "src/services/store"

  export default async function handleOrderPlaced({ 
    data, eventName, container, pluginOptions, 
  }: SubscriberArgs<Record<string, string>>) {
    const orderService: OrderService = container.resolve("orderService")
    const storeService: StoreService = container.resolve("storeService")
    const { id: orderId } = data

    const order = await orderService.retrieve(orderId, {
        relations: ["store"],
      })
    
      const store = await storeService.retrieve()
      // Get the store ID from the retrieved order
    //  const storeId = order.store.id

    // await orderService.consoleLogging(store)
    await orderService.bindOrderToStore(order.id,store.id)
  }
  
  export const config: SubscriberConfig = {
    event: OrderService.Events.PLACED,
    context: {
      subscriberId: "order-placed-handler",
    },
  }

  