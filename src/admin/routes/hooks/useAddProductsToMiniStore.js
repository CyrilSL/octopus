import { useState } from 'react';
import { useAdminGetSession, useAdminCustomPost } from "medusa-react";

const useManageProducts = (triggerRefresh) => {
  const { user } = useAdminGetSession();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const customPost = useAdminCustomPost('/admin/add_products', ["addProducts"]);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(current => {
      const isCurrentlySelected = current.includes(productId);
      return isCurrentlySelected ? current.filter(id => id !== productId) : [...current, productId];
    });
  };

  const handleSubmit = async () => {
    const data = { storeId: user.store_id, productIds: selectedProducts };
    customPost.mutate(data, {
      onSuccess: () => {
        setSelectedProducts([]);
        triggerRefresh(); // Refresh the list of products
      },
      onError: (error) => {
        console.error('Failed to add products:', error);
      }
    });
  };

  return { selectedProducts, handleCheckboxChange, handleSubmit };
};
