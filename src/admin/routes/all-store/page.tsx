import React, { useState, useEffect } from 'react';
import { useAdminGetSession, useAdminCustomQuery } from "medusa-react";
import { Heading, Container, Table, Label, Button, FocusModal } from "@medusajs/ui";
import { RouteConfig } from '@medusajs/admin';


const AllStores = () => {
  const { isLoading: isUserLoading } = useAdminGetSession();
  const { data: allStoresData, isLoading: isLoadingAllStores } = useAdminCustomQuery(
    `/admin/all_stores`,
    [`allStores`]
  );
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
  } = useAdminCustomQuery(
    selectedStoreId ? `/admin/fetch_products/${selectedStoreId}` : null,
    [`fetchProducts`, selectedStoreId],
    {
      enabled: !!selectedStoreId,
    }
  );

  const allStores = allStoresData?.store || [];

  const handleStoreSelect = (store) => {
    setSelectedStoreId(store.id);
    setModalIsOpen(true);
  };

  const selectedStore = allStores.find(store => store.id === selectedStoreId);

  if (isUserLoading || isLoadingAllStores) {
    return <span>Loading...</span>;
  }

  if (allStores.length === 0) {
    return (
      <Container>
        <div className='px-xlarge py-large'>
          <Heading>No Stores Found!</Heading>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className='px-xlarge py-large'>
        <Heading>All Stores</Heading>
      </div>
      
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Store Name</Table.HeaderCell>
            <Table.HeaderCell>Store ID</Table.HeaderCell>
            <Table.HeaderCell>Currency Code</Table.HeaderCell>
            <Table.HeaderCell>Domain</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {allStores.map((store) => (
            <Table.Row key={store.id} onClick={() => handleStoreSelect(store)}>
              <Table.Cell>
                <Label>{store.name}</Label>
              </Table.Cell>
              <Table.Cell>
                <Label>{store.id}</Label>
              </Table.Cell>
              <Table.Cell>
                <Label>{store.default_currency_code}</Label>
              </Table.Cell>
              <Table.Cell>
                <Label>{store.domain || 'N/A'}</Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      
      {selectedStore && (
   <FocusModal>
   <FocusModal.Trigger asChild>
     <Button className="mt-4">Close Details</Button>
   </FocusModal.Trigger>
   <FocusModal.Content className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
     <FocusModal.Header className="border-b pb-4">
       <Heading className="text-2xl font-bold text-gray-900">
         {selectedStore.name}
       </Heading>
     </FocusModal.Header>
     <FocusModal.Body className="pt-6">
       <div className="space-y-4">
         <p className="text-sm text-gray-500">Store ID: <span className="text-gray-700">{selectedStore.id}</span></p>
         <p className="text-sm text-gray-500">Default Currency Code: <span className="text-gray-700">{selectedStore.default_currency_code}</span></p>
         <p className="text-sm text-gray-500">Domain: <span className="text-gray-700">{selectedStore.domain || 'N/A'}</span></p>
         <p className="text-sm text-gray-500">Created At: <span className="text-gray-700">{selectedStore.created_at}</span></p>
         <p className="text-sm text-gray-500">Updated At: <span className="text-gray-700">{selectedStore.updated_at}</span></p>
         <div className="pt-4">
           <Heading className="text-lg font-semibold text-gray-900">Products</Heading>
           {isLoadingProducts ? (
             <p className="text-gray-500">Loading Products...</p>
           ) : (
             <ul className="list-disc pl-5 space-y-2">
               {productsData?.products.map(product => (
                 <li key={product.id} className="text-sm text-gray-700">{product.title} - {product.description}</li>
               ))}
             </ul>
           )}
         </div>
       </div>
     </FocusModal.Body>
   </FocusModal.Content>
 </FocusModal>
 
      )}
    </Container>
  );
};

export const config: RouteConfig = {
  link: {
    label: "All Stores",
    // icon: CustomIcon,
  },
};

export default AllStores;
