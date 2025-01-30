import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { Element } from '../interfaces/Element.component';
import { toastError } from '../notification/ToastNotification.component';
import styles from '../productPages/productpage.module.css';
import { RatingStars } from '../ratingProduct/Rating.Component';

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

  if (!product) {
    return <div className={styles.productNotFound}>Product was not found</div>;
  }

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
          <div className={styles.productRatingContainer}>
            <RatingStars rating={product?.rating ?? 0} />
          </div>
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
