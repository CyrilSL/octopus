import React, { useState, useEffect } from 'react';
import { RouteConfig } from "@medusajs/admin";
import { useAdminProducts, useAdminGetSession } from "medusa-react";
import { Checkbox, Label, Table, Heading, Button, Container } from "@medusajs/ui";

const AddProducts = () => {
  const { products, isLoading: isProductsLoading } = useAdminProducts({ fields: "title,handle" });
  const { user, isLoading: isUserLoading } = useAdminGetSession();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [miniStoreProducts, setMiniStoreProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [refresh, setRefresh] = useState(false); // State variable to trigger re-render
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => setRefreshCounter(c => c + 1);

  useEffect(() => {
    const fetchMiniStoreProducts = async () => {
      try {
        const response = await fetch(`http://localhost:9000/admin/fetch_products/${user.store_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSEtWQlJOWjg5UVlESzZaV0NEWEpCQjI4IiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE3MDY1MzQyMDAsImV4cCI6MTcwNjYyMDYwMH0.4jgDYVGdcatNC_DGL6iTBqsiraYQ8SOTiwedaq_AqGI' // Replace <YOUR_TOKEN_HERE> with the actual token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch mini store products');
        }

        const data = await response.json();
        console.log("Mini Store Products = "+data.products);
        console.log("Admin all products = "+products)
        console.log("isProductLoading = "+isProductsLoading)
        
        setMiniStoreProducts(data.products); // Assuming the response contains a products array
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.store_id) {
      fetchMiniStoreProducts();
    }
  }, [user?.store_id, products, refreshCounter]);

  

  useEffect(() => {
    if (!isProductsLoading && !isUserLoading && miniStoreProducts.length > 0) {
      // Filter out products that are already in the mini store.
      // This assumes miniStoreProducts is an array of product IDs or has a property that can be used to identify them uniquely.
      const filteredProducts = products.filter(product => 
        !miniStoreProducts.some(miniProduct => miniProduct.id === product.id)
      );
      setAvailableProducts(filteredProducts);
    }
  }, [products, miniStoreProducts, isProductsLoading, isUserLoading]);
  



  const handleCheckboxChange = (productId) => {
    setSelectedProducts(currentSelectedProducts => {
      if (currentSelectedProducts.includes(productId)) {
        return currentSelectedProducts.filter(id => id !== productId);
      } else {
        return [...currentSelectedProducts, productId];
      }
    });
  };

  const handleSubmit = async () => {
    const productIds = selectedProducts;
    const storeId = user.store_id;
    console.log("Selected Products are these bruv:", selectedProducts);
    console.log("User's Store ID is :", user.store_id); // Log the logged-in user's details

    // Prepare the data for sending
    const data = {
      storeId: user.store_id,
      productIds: selectedProducts
    };

    console.log('utton press');
    try {
      const response = await fetch('http://localhost:9000/admin/add_products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSEtWQlJOWjg5UVlESzZaV0NEWEpCQjI4IiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE3MDY1MzQyMDAsImV4cCI6MTcwNjYyMDYwMH0.4jgDYVGdcatNC_DGL6iTBqsiraYQ8SOTiwedaq_AqGI' // Replace <YOUR_TOKEN_HERE> with the actual token
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // or response.json() if the server sends JSON response
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }



      const responseData = await response.json();
      console.log('Successfully added products:', responseData);
      triggerRefresh(); // Instead of setRefresh(prev => !prev);
      // Handle success response
    } catch (error) {
      console.error('Failed to add products:', error);
      // Handle error case
    }
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
