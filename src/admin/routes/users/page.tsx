import React, { useState, useEffect } from 'react';
import { useAdminGetSession, useAdminCustomQuery, useAdminCustomDelete } from "medusa-react";
import { Checkbox, Label, Table, Heading, Button, Container } from "@medusajs/ui";
import { RouteConfig } from "@medusajs/admin";
import { useAdminStore } from "medusa-react"
import { Input } from "@medusajs/ui"


const StoreDetails = () => {
    const { 
        store,
        isLoading
      } = useAdminStore();
      console.log(store);
  return (
    <Container>
      <div>
      <h2>Admin Store Data</h2>
      {/* Display your store data here */}
      <pre>{JSON.stringify(store, null, 2)}</pre>
      
    </div>
    </Container>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Store Details",
    // icon: CustomIcon,
  },
};

export default StoreDetails;
