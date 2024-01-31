import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
// Adjust the import path as necessary for your project structure
import ProductService from "src/services/product";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Resolve the ProductService from the request scope
    const productService = req.scope.resolve("productService") as ProductService;

    // Extract storeId and productIds from the request body
    const { storeId, productIds } = req.body;

    // Check for required parameters
    if (!storeId || !productIds || productIds.length === 0) {
      return res.status(400).json({ message: "Missing storeId or productIds" });
    }

    // Use the addProducts method to add products to the store
    await productService.addProducts(storeId, productIds);

    // Respond with success message
    res.status(200).json({ message: "Products added to store successfully" });
  } catch (error) {
    // Handle any errors that might occur
    res.status(500).json({ message: error.message });
  }
};
