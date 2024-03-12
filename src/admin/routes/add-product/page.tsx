import React, { useState, useEffect } from 'react';
import { RouteConfig } from "@medusajs/admin";
import { useAdminProducts, useAdminGetSession, useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Checkbox, Label, Table, Heading, Button, Container } from "@medusajs/ui";

const AddProducts = () => {
  const { products, isLoading: isProductsLoading } = useAdminProducts({ fields: "title,handle" });
  const { user, isLoading: isUserLoading } = useAdminGetSession();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => setRefreshCounter(c => c + 1);

  // Adjusted to use useAdminCustomQuery
  const {
    data: miniStoreProductsData,
    isLoading: isMiniStoreProductsLoading,
    isError: isMiniStoreProductsError
  } = useAdminCustomQuery(
    user?.store_id ? `/admin/fetch_products/${user.store_id}` : null, // Conditional endpoint based on user.store_id
    [`fetchMiniStoreProducts`, user?.store_id, refreshCounter], // Ensuring unique key + refetch on user or refreshCounter change
  );

  const customPost = useAdminCustomPost(
    '/admin/add_products',
    ["addProducts"] // The queryKey can be any unique string that makes sense for your use case
  );
  

  useEffect(() => {
    if (!isProductsLoading && !isUserLoading && !isMiniStoreProductsLoading && !isMiniStoreProductsError) {
      const miniStoreProducts = miniStoreProductsData?.products || [];
      const filteredProducts = products.filter(product => 
        !miniStoreProducts.some(miniProduct => miniProduct.id === product.id)
      );
      setAvailableProducts(filteredProducts);
    }
  }, [products, miniStoreProductsData, isProductsLoading, isUserLoading, isMiniStoreProductsLoading, isMiniStoreProductsError]);



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

  const handleSubmit = async () => {
    const productIds = selectedProducts;
    const storeId = user.store_id;
    console.log("Selected Products are these bruv:", selectedProducts);
    console.log("User's Store ID is :", user.store_id); // Log the logged-in user's details

    const data = {
      storeId: user.store_id,
      productIds: selectedProducts
    };

    customPost.mutate(data, {
      onSuccess: (response) => {
        console.log('Successfully added products:', response);
        setSelectedProducts([]);
        triggerRefresh(); // Refresh the list of products
        // Optionally, handle any follow-up actions here, such as displaying a success message
      },
      onError: (error) => {
        console.error('Failed to add products:', error);
        // Optionally, handle errors, such as displaying error messages
      }
    });
  };

  if (isUserLoading || isProductsLoading) {
    return <span>Loading...</span>;
  }

  if (!products.length) {
    return <span>No Products</span>;
  }

  

  return (
    <Container>
      <div className='px-xlarge py-large'>
        <div className='flex items-start justify-between'>
        <Heading>Add Products</Heading>
        <Button variant="secondary" className="btn btn-secondary btn-small flex items-center" onClick={handleSubmit}>Add Selected Products</Button>
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
  {availableProducts.map((product) => (
    <Table.Row key={product.id}>
      <Table.Cell>
        <Checkbox 
          id={`product-${product.id}`} 
          checked={selectedProducts.includes(product.id)}
          onCheckedChange={() => handleCheckboxChange(product.id)}
        />
      </Table.Cell>
      <Table.Cell>
        <Label htmlFor={`product-${product.id}`}>{product.title}</Label>
      </Table.Cell>
    </Table.Row>
  ))}
</Table.Body>
      </Table>
    </Container>
  );
  
}

export const config: RouteConfig = {
  link: {
    label: "Add Products",
    // icon: CustomIcon,
  },
};

export default AddProducts;
