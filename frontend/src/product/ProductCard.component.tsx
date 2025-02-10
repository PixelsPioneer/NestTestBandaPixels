import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import 'slick-carousel/slick/slick.css';

import AuthGuard from '../authGuard/AuthGuard.component';
import axiosInstance from '../axioInterceptors/TokenInterceptors';
import { apiEndpoints } from '../constants/constants';
import type { Element } from '../interfaces/Element.component';
import { Modal } from '../modalWindow/Modal.component';
import { toastError } from '../notification/ToastNotification.component';
import { RatingStars } from '../ratingProduct/Rating.Component';
import { Carousel } from '../slick/Carousel.component';
import '../slick/slick-theme.css';
import { useTokenContext } from '../tokenContext/TokenContext';
import styles from './product-list.module.css';

export interface CardProps {
  element: Element;
  onDelete: () => void;
}

export const ProductCard: FC<CardProps> = ({ element, onDelete }) => {
  const { accessToken } = useTokenContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    setModalVisible(false);

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axiosInstance.delete(apiEndpoints.products.productDelete(id.toString()), { headers });

      if (response.status === 200) {
        onDelete();
      } else {
        toastError('Failed to delete product. Please try again.');
      }
    } catch (error) {
      toastError('Error deleting product');
    }
  };

  const goToProductPage = () => {
    navigate(`/product/${element.id}`);
  };

  return (
    <>
      <li className={styles.card} key={element.id}>
        <AuthGuard>
          {
            <div className={styles.closeButtonContainer}>
              <button className={styles.closeButton} onClick={() => setModalVisible(true)}>
                &#10005;
              </button>
            </div>
          }
        </AuthGuard>
        <div className={styles.carouselConatiner}>
          <Carousel>
            {Array.isArray(element.profileImages) &&
              element.profileImages.map((imageUrl, index) => (
                <div key={index} className={styles.ImgContainer}>
                  <img
                    key={index}
                    className={styles.productImage}
                    src={imageUrl}
                    alt={element.title || 'No title available'}
                    onClick={goToProductPage}
                  />
                </div>
              ))}
          </Carousel>
        </div>

        <p className={styles.productTitle} onClick={goToProductPage}>
          {(element.title as string).length > 60 ? `${(element.title as string).slice(0, 60)}...` : element.title}
        </p>

        <div className={styles.productInfoContainer}>
          <div className={styles.ratingProductContainer}>
            <div className={styles.productInfoContainer}>
              <RatingStars rating={element?.rating ?? 0} />
            </div>
          </div>

          <div className={styles.priceContainer}>
            {element.hasDiscount && <p className={styles.oldPrice}>{element.price}₴</p>}
            <p className={styles.productPrice}>{element.hasDiscount ? element.newPrice : element.price}₴</p>
          </div>
          <p className={styles.productSource}>Source: {element.source}</p>
          <p className={styles.productType}>{element.type}</p>
        </div>
      </li>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => handleDelete(element.id)}
        title="Are you sure you want to delete this product?"></Modal>
    </>
  );
};
