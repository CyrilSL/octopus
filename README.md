Read the RBAC Documentation and
Ability to create multiple roles have been created 
Post to http://localhost:9000/admin/roles
example : {
  "store_id": "<Store ID>",
  "name": "Affiliate",
  "permissions": [
    {
      "name": "Enable Products",
      "metadata": {
          "/products": true
      }
    }
  ]
}

Can add assign Roles to users
localhost:9000/admin/roles/[role-ID]/user/[user-ID]


store_products join table is create that has primary key of products and store
