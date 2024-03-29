import React from 'react';
import { useAdminCustomQuery } from "medusa-react";
import { Heading, Container, Table, Label } from "@medusajs/ui";
import { RouteConfig } from '@medusajs/admin';
import { useAdminStore } from "medusa-react"

const StoreOrders = () => {
    const { 
        store,
        isLoading
      } = useAdminStore();
      console.log(store);

      const storeID = store.id;
  const { data: storeOrdersData, isLoading: isLoadingStoreOrders } = useAdminCustomQuery(
    `/admin/store-orders/${store.id}`,
    [`storeOrders`]
  );

  const storeOrders = storeOrdersData || [];

    console.log("Store Orders Data : ",storeOrdersData);
    console.log("Store Orders Array : ",storeOrders);

  if (isLoadingStoreOrders) {
    return <span>Loading...</span>;
  }

  return (
    <Container>
      <div className='px-xlarge py-large'>
        <Heading>Store Orders</Heading>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Order ID</Table.HeaderCell>
            <Table.HeaderCell>Store Name</Table.HeaderCell>
            <Table.HeaderCell>Order Status</Table.HeaderCell>
            <Table.HeaderCell>Payment Status</Table.HeaderCell>
            <Table.HeaderCell>Fulfillment Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
  {Object.keys(storeOrders).map((key) => (
    <Table.Row key={storeOrders[key].id}>
      <Table.Cell>
        <Label>{storeOrders[key].id}</Label>
      </Table.Cell>
      <Table.Cell>
        <Label>store name here</Label>
      </Table.Cell>
      <Table.Cell>
        <Label>{storeOrders[key].status}</Label>
      </Table.Cell>
      <Table.Cell>
        <Label>{storeOrders[key].payment_status}</Label>
      </Table.Cell>
      <Table.Cell>
        <Label>{storeOrders[key].fulfillment_status}</Label>
      </Table.Cell>
    </Table.Row>
  ))}
</Table.Body>

      </Table>
    </Container>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Store Orders",
    // icon: CustomIcon,
  },
};

export default StoreOrders;