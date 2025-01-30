import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { Element } from '../interfaces/Element.component';
import { toastError } from '../notification/ToastNotification.component';
import styles from '../productPages/productpage.module.css';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<Element | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error('Error: Product ID is undefined');
        return;
      }

      try {
        const response = await axios.get(apiEndpoints.products.productID(id));
        setProduct(response.data);
      } catch (error) {
        toastError('Error fetching product:');
      }
    };

    fetchProduct();
  }, [id]);

  const handleButtonClick = () => {
    if (product?.subtitle) {
      window.open(product.subtitle, '_blank');
    } else {
      toastError('No subtitle link available');
    }
  };

  const parsedSpecifications = (() => {
    if (!product?.specifications || typeof product.specifications !== 'string') {
      return null;
    }

    try {
      return JSON.parse(product.specifications);
    } catch (error) {
      toastError('Error parsing specifications');
      return null;
    }
  })();

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.productContainer}>
      <div className={styles.productContainerImage}>
        <img className={styles.productImage} src={product.profileImage} alt={product.title || 'No title available'} />
      </div>
      <div className={styles.detailProductContainer}>
        <div className={styles.productDetailsContainer}>
          <h1 className={styles.productTitle}>{product.title}</h1>
        </div>

        <div className={styles.productSpecificationsContainer}>
          {parsedSpecifications ? (
            Array.isArray(parsedSpecifications) ? (
              <ul>
                {parsedSpecifications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <ul>
                {Object.entries(parsedSpecifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}</strong> {String(value)}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className={styles.productSpecifications}>{product.specifications}</p>
          )}
        </div>

        <div className={styles.ratingProductContainer}>
          <div className={styles.starsContainer}>
            {Array.from({ length: 5 }, (_, index) => {
              const rating = product?.rating ?? 0;
              const roundedRating = Math.round(rating * 2) / 2;
              const isFullStar = index < Math.floor(roundedRating);
              const isHalfStar = index === Math.floor(roundedRating) && roundedRating % 1 !== 0;

              return (
                <span
                  key={index}
                  className={isFullStar ? styles.filledStar : isHalfStar ? styles.halfStar : styles.emptyStar}>
                  ★
                </span>
              );
            })}
          </div>
          <span className={styles.ratingText}>{(product.rating ?? 0).toFixed(1)}</span>
        </div>
        <div className={styles.productButtonContainer}>
          <button className={styles.goToStoreButton} onClick={handleButtonClick}>
            Go To Store
          </button>
        </div>
      </div>
    </div>
  );
};
