import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Element } from '../interfaces/Element.component';
import { Card } from './Card.component';
import styles from './product-list.module.css';
import { showSuccessNotification } from './ToastNotification.component';

export const Api: React.FC = () => {
    const [elements, setElements] = useState<Element[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                  `${process.env.REACT_APP_API_BASE_URL}/product`
                );
                setElements(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = (id: number) => {
        setElements((prevElements) => prevElements.filter((element) => element.id !== id));
        showSuccessNotification('Product deleted successfully !');
    };

    return (
      <div>
          <h1>Products</h1>
          {elements.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <ul className={styles.cardContainer}>
                {elements.map((element) => (
                  <Card
                    key={element.id}
                    element={element}
                    onDelete={() => handleDelete(element.id)}
                  />
                ))}
            </ul>
          )}
      </div>
    );
};
