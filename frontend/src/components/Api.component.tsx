import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Element } from '../interfaces/Element.component';
import { Card } from './Card.component';
import styles from './product-list.module.css';

export const Api: React.FC = () => {
    const [elements, setElements] = useState<Element[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/product'
                );
                setElements(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Products</h1>
            {elements.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <ul className={styles.cardContainer}>
                    {elements.map((element) => (
                        <Card key={element.id} element={element} />
                    ))}
                </ul>
            )}
        </div>
    );
};