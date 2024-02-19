import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import StoreService from "src/services/store";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
      // Resolve the StoreService from the request scope
      const storeService = req.scope.resolve("storeService") as StoreService;

      // Retrieve the store for the logged-in user
      const store = await storeService.listAllStores();
      
      // Check if the store exists
      if (store ) {
          // Send the store_id in the response
          res.status(200).json({ store });
      } else {
          // If the store doesn't exist or doesn't have an id, return an error
          res.status(404).json({ message: "Stores not found" });
      }
  } catch (error) {
      // Handle any errors
      res.status(500).json({ message: error.message });
  }
};
