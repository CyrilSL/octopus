
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
// Adjust the import path as necessary for your project structure
import StoreService from "src/services/store";

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Resolve the StoreService from the request scope
    const storeService = req.scope.resolve("storeService") as StoreService;

    // Extract storeId and domain from the request body
    const { storeId, domain } = req.body;

    // Check for required parameters
    if (!storeId || !domain) {
      return res.status(400).json({ message: "Missing storeId or domain" });
    }

    // Use the updateStoreDomain method to update the store's domain
    await storeService.updateStoreDomain(storeId, domain);

    // Respond with success message
    res.status(200).json({ message: "Store domain updated successfully" });
  } catch (error) {
    // Handle any errors that might occur
    res.status(500).json({ message: error.message });
  }
};
