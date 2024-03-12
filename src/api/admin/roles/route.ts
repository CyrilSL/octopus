import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  import RoleService from "../../../services/role"
  export const POST = async (
    req: MedusaRequest, 
    res: MedusaResponse
  ) => {
    // omitting validation for simplicity
    const {
      name,
      store_id,
      permissions = [],
    } = req.body

    const roleService = req.scope.resolve(
      "roleService"
    ) as RoleService
    

    const role = await roleService.create({
      name,
      store_id,
      permissions,
    })
  
    res.json(role)
  }