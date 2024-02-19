import { useState, useEffect } from 'react';
import { useAdminProducts, useAdminGetSession, useAdminCustomQuery } from "medusa-react";

const useFetchProducts = () => {
  const { products, isLoading: isProductsLoading } = useAdminProducts({ fields: "title,handle" });
  const { user, isLoading: isUserLoading } = useAdminGetSession();
  const [availableProducts, setAvailableProducts] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { data: miniStoreProductsData, isLoading: isMiniStoreProductsLoading } = useAdminCustomQuery(
    user?.store_id ? `/admin/fetch_products/${user.store_id}` : null,
    [`fetchMiniStoreProducts`, user?.store_id, refreshCounter],
  );

  useEffect(() => {
    if (!isProductsLoading && !isUserLoading && !isMiniStoreProductsLoading) {
      const miniStoreProducts = miniStoreProductsData?.products || [];
      const filteredProducts = products.filter(product => 
        !miniStoreProducts.some(miniProduct => miniProduct.id === product.id)
      );
      setAvailableProducts(filteredProducts);
    }
  }, [products, miniStoreProductsData, isProductsLoading, isUserLoading, isMiniStoreProductsLoading]);

  return { availableProducts, isUserLoading, isProductsLoading, isMiniStoreProductsLoading, triggerRefresh: () => setRefreshCounter(c => c + 1) };
};
