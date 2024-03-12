
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
// Adjust the import path as necessary for your project structure
import DomainService from "src/services/domain";

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Resolve the StoreService from the request scope
    const domainService = req.scope.resolve("domainService") as DomainService;

    // Extract storeId and domain from the request body
    const { storeId, domain } = req.body;

    // Check for required parameters
    if (!storeId || !domain) {
      return res.status(400).json({ message: "Missing storeId or domain" });
    }

    // Use the updateStoreDomain method to update the store's domain
    await domainService.updateStoreDomain(storeId, domain);

    // Respond with success message
    res.status(200).json({ message: "Store domain updated successfully" });
  } catch (error) {
    // Handle any errors that might occur
    res.status(500).json({ message: error.message });
  }
};
