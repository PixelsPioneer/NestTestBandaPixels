import { useEffect, useState } from 'react';

import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import type { Element } from '../interfaces/Element.component';
import { ProductCard } from './ProductCard.component';
import { toastError, toastSuccess } from './ToastNotification.component';
import styles from './product-list.module.css';

export const ProductsComponent: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoints.products.products);
        if (!response || !response.data) {
          toastError('No data received.');
          return;
        }
        setElements(response.data);
      } catch (error) {
        toastError('Error fetching data.');
        return;
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setElements(prevElements => prevElements.filter(element => element.id !== id));
    toastSuccess('Product deleted successfully !');
  };

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
