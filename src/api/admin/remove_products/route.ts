import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from "src/services/product";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productService = req.scope.resolve("productService") as ProductService;

    // Extract storeId and productIds from the request body, matching the add_product route input
    const { storeId, productIds } = req.body;

    // Validate the required parameters
    if (!storeId || !productIds || productIds.length === 0) {
      return res.status(400).json({ message: "Missing storeId or productIds" });
    }

    // Assuming you have updated your ProductService to include a removeProducts method
    // that takes an array of productIds and removes them from the specified store
    await productService.removeProducts(storeId, productIds);

    res.status(200).json({ message: "Products removed from store successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
