import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
import ProductService from "src/services/product"  

  
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const storeId = req.params.store_id; // Assuming the store ID is passed as a URL parameter
    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const productService = req.scope.resolve("productService") as ProductService;
    const products = await productService.fetchProducts(storeId);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};