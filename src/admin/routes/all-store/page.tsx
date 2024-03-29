import React, { useState, useEffect } from 'react';
import { useAdminGetSession, useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Heading, Container, Table, Label, Button, Drawer, Input } from "@medusajs/ui";
import { RouteConfig } from '@medusajs/admin';


const AllStores = () => {
  const { isLoading: isUserLoading } = useAdminGetSession();
  const { data: allStoresData, isLoading: isLoadingAllStores } = useAdminCustomQuery(
    `/admin/all_stores`,
    [`allStores`]
  );
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [newDomain, setNewDomain] = useState(""); // State to hold the new domain

  // Hook for adding/updating domain
  const updateDomain = useAdminCustomPost<{storeId: string, domain: string}, {message: string}>(
    "/admin/add_domain",
    ["updateDomain"], // This is the queryKey
    // You can provide relatedDomains and options as needed, here's an example with default options
  );

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

  console.log("All Stores : ",allStores)
  console.log("All Store from API : ",allStoresData)

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


  const handleUpdateDomain = () => {
    if (selectedStoreId && newDomain) {
      updateDomain.mutate({
        storeId: selectedStoreId,
        domain: newDomain,
      }, {
        onSuccess: () => {
          alert("Domain updated successfully!");
          setModalIsOpen(false); // Close the modal on success
        },
        onError: (error) => {
          console.error("Failed to update domain:", error);
          alert("Failed to update domain.");
        },
      });
    }
  };

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
   <Drawer>
   <Drawer.Trigger asChild>
     <Button className="mt-4">View Store Info</Button>
   </Drawer.Trigger>
   <Drawer.Content className="bg-white rounded-lg p-4 shadow-lg max-w-md mx-auto space-y-4">
            <Drawer.Header className="flex justify-between items-center">
              <Drawer.Title className="text-gray-900">
                {selectedStore.name}
              </Drawer.Title>
              <div className="text-xs text-gray-400">
                <p>Created: {selectedStore.created_at}</p>
                <p>Updated: {selectedStore.updated_at}</p>
              </div>
            </Drawer.Header>
            <Drawer.Body>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Store ID: <span className="font-medium text-gray-700">{selectedStore.id}</span></p>
                <p className="text-sm text-gray-500">Currency: <span className="font-medium text-gray-700">{selectedStore.default_currency_code}</span></p>
                <p className="text-sm text-gray-500">Domain: <span className="font-medium text-gray-700">{selectedStore.domain || 'N/A'}</span></p>
                <div>
                  <Heading className="text-lg font-semibold text-gray-900 mb-2">Products</Heading>
                  {isLoadingProducts ? (
                    <p className="text-gray-500">Loading Products...</p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1">
                      {productsData?.products.map(product => (
                        <li key={product.id} className="text-sm text-gray-700">{product.title} - {product.description}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="pt-2">
                  <Label className="block mb-2">Update Domain</Label>
                  <Input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="Enter new domain" className="mb-2" />
                  <Button onClick={handleUpdateDomain}>Update Domain</Button>
                </div>
              </div>
            </Drawer.Body>
          </Drawer.Content>
 </Drawer>
 
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
