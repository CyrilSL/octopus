import React, { useState, useEffect } from 'react';
import { useAdminGetSession } from "medusa-react";
import { Checkbox, Label, Table, Heading, Button, Container } from "@medusajs/ui";
import { RouteConfig } from "@medusajs/admin";

const RemoveProducts = () => {
  const { user, isLoading: isUserLoading } = useAdminGetSession();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [miniStoreProducts, setMiniStoreProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMiniStoreProducts = async () => {
      const response = await fetch(`http://localhost:9000/admin/fetch_products/${user.store_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSEtWQlJOWjg5UVlESzZaV0NEWEpCQjI4IiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE3MDY1MzQyMDAsImV4cCI6MTcwNjYyMDYwMH0.4jgDYVGdcatNC_DGL6iTBqsiraYQ8SOTiwedaq_AqGI' // Update with actual token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mini store products');
      }

      const data = await response.json();
      setMiniStoreProducts(data.products);
    };

    if (user?.store_id) {
      fetchMiniStoreProducts();
    }
  }, [user?.store_id, refresh]);

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
    console.log("selected products = ",selectedProducts)
    const response = await fetch('http://localhost:9000/admin/remove_products', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSEtWQlJOWjg5UVlESzZaV0NEWEpCQjI4IiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE3MDY1MzQyMDAsImV4cCI6MTcwNjYyMDYwMH0.4jgDYVGdcatNC_DGL6iTBqsiraYQ8SOTiwedaq_AqGI' // Update with actual token
      },
      body: JSON.stringify({
        storeId: user.store_id,
        productIds: selectedProducts,
      }),
    });

    if (!response.ok) {
      // Handle error
      console.error('Failed to remove products');
      return;
    }

    // Clear selection and trigger refresh
    setSelectedProducts([]);
    setRefresh(prev => !prev);
  };

  if (isUserLoading) {
    return <span>Loading...</span>;
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
    label: "Remove Products",
    // icon: CustomIcon,
  },
};

export default RemoveProducts;
