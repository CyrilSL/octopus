import React, { useState, useEffect } from 'react';
import { useAdminGetSession, useAdminCustomQuery, useAdminCustomDelete } from "medusa-react";
import { Checkbox, Label, Table, Heading, Button, Container } from "@medusajs/ui";
import { RouteConfig } from "@medusajs/admin";

const RemoveProducts = () => {
  const { user, isLoading: isUserLoading } = useAdminGetSession();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { data: miniStoreProductsData, isLoading: isLoadingMiniStoreProducts } = useAdminCustomQuery(
    user?.store_id ? `/admin/fetch_products/${user.store_id}` : null,
    [`miniStoreProducts`, user?.store_id],
  );
  const miniStoreProducts = miniStoreProductsData?.products || [];

  // Construct the URL with query parameters
  const constructDeleteUrl = () => {
    const queryParams = new URLSearchParams({
      storeId: user.store_id,
      productIds: selectedProducts.join(','),
    }).toString();
    return `/admin/remove_products?${queryParams}`;
  };

  const customDelete = useAdminCustomDelete(
    constructDeleteUrl(), // This function will construct the URL dynamically
    [`miniStoreProducts`, user?.store_id]
  );

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(current => {
      const isCurrentlySelected = current.includes(productId);
      if (isCurrentlySelected) {
        return current.filter(id => id !== productId);
      } else {
        return [...current, productId];
      }
    });
  };

  const handleSubmit = () => {
    // Use mutate for deletion with onSuccess callback for cache invalidation and UI feedback
    customDelete.mutate(void 0, {
      onSuccess: () => {
        // Optionally, handle success state, e.g., showing a success message
        console.log('Products removed successfully');
        setSelectedProducts([]); // Clear selection after successful deletion
      },
      onError: (error) => {
        // Optionally, handle error state, e.g., showing an error message
        console.error('Failed to remove products:', error);
      }
    });
  };
  if (isUserLoading) {
    return <span>Loading...</span>;
  }

  if (miniStoreProducts.length === 0) {
    return (
      <Container>
        <div className='px-xlarge py-large'>
          <Heading>No Products in your store yet!</Heading>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className='px-xlarge py-large'>
        <div className='flex items-start justify-between'>
          <Heading>Remove Products</Heading>
          <Button variant="secondary" onClick={handleSubmit}>Remove Selected Products</Button>
        </div>
      </div>
      
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Select</Table.HeaderCell>
            <Table.HeaderCell>Product Title</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {miniStoreProducts.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>
                <Checkbox 
                  id={`remove-product-${product.id}`} 
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleCheckboxChange(product.id)}
                />
              </Table.Cell>
              <Table.Cell>
                <Label htmlFor={`remove-product-${product.id}`}>{product.title}</Label>
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
    label: "My Products",
    // icon: CustomIcon,
  },
};

export default RemoveProducts;
