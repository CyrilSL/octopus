import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  import RoleService from "../../../../../../services/role"
  
  export const POST = async (
    req: MedusaRequest, 
    res: MedusaResponse
  ) => {
    // omitting validation for simplicity purposes
    const {
      id,
      user_id,
    } = req.params
  
    const roleService = req.scope.resolve(
      "roleService"
    ) as RoleService
    const role = await roleService.associateUser(id, user_id)
  
    res.json(role)
  }