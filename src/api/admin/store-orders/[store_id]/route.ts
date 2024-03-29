import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "src/services/order";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const orderService = req.scope.resolve("orderService") as OrderService;
    const store_id  = req.params.store_id;

    if (!store_id) {
      return res.status(400).json({ message: "Missing storeId" });
    }

    // Fetch store orders
    const storeOrders = await orderService.getStoreOrders(store_id);

    // Send the fetched orders in the response
    res.status(200).json(storeOrders);
  } catch (error) {
    // Handle errors thrown by orderService.getStoreOrders(storeId)
    res.status(500).json({ message: error.message });
  }
};