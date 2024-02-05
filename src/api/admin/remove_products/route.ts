import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from "src/services/product";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productService = req.scope.resolve("productService") as ProductService;

    // Extract storeId from query parameters
    const storeId = req.query.storeId as string;

    // Extract productIds from query parameters and split by comma to get an array
    const productIds = (req.query.productIds as string)?.split(',');

    // Validate the required parameters
    if (!storeId || !productIds || productIds.length === 0) {
      return res.status(400).json({ message: "Missing storeId or productIds" });
    }

    await productService.removeProducts(storeId, productIds);

    res.status(200).json({ message: "Products removed from store successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
