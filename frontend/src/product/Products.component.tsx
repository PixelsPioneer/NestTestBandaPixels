import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import type { Element } from '../interfaces/Element.component';
import { toastError, toastSuccess } from '../notification/ToastNotification.component';
import { useTokenContext } from '../tokenContext/TokenContext';
import { ProductCard } from './ProductCard.component';
import styles from './product-list.module.css';

export const ProductsComponent: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { accessToken } = useTokenContext();

  const getProducts = useMutation({
    mutationFn: async () => {
      const response = await axios.get(apiEndpoints.products.products);

      return response.data;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: data => {
      setElements(data);
    },
    onError: error => {
      console.error('Error fetching data:', error);
      toastError('Error fetching data.');
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await getProducts.mutateAsync();
    };

    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setElements(prevElements => prevElements.filter(element => element.id !== id));
    toastSuccess('Product deleted successfully !');
  };

  if (!accessToken) {
    return null;
  }

  return (
    <div>
      <h1>Products</h1>
      {elements.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className={styles.cardContainer}>
          {elements.map(element => (
            <ProductCard key={element.id} element={element} onDelete={() => handleDelete(element.id)} />
          ))}
        </ul>
      )}
    </div>
  );
};
