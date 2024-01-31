// hooks/useAddProductsToStore.js
import { useMutation } from '@tanstack/react-query';

const addProductsToStore = async ({ storeId, productIds, token }) => {
  const response = await fetch('http://localhost:9000/admin/add_products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include the bearer token in the Authorization header
    },
    body: JSON.stringify({ storeId, productIds }),
  });

  if (!response.ok) {
    // Attempt to read the response body and throw an error with its content
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to add products to store');
  }

  return response.json();
};

export function useAddProductsToStore() {
  return useMutation(addProductsToStore);
}
