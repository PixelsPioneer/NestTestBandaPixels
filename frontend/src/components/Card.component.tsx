import { FC, useState } from 'react';
import { Element } from '../interfaces/Element.component';
import { Modal } from './Modal.component';
import axios from 'axios';
import styles from './product-list.module.css';

export interface CardProps {
  element: Element;
  onDelete: () => void;
}

export const Card: FC<CardProps> = ({ element, onDelete }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleButtonClick = () => {
    if (element.subtitle) {
      window.open(element.subtitle, '_blank');
    } else {
      console.error("No subtitle link available");
    }
  };

  const handleDelete = async () => {
    setModalVisible(false);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/product/${element.id}`);
      onDelete();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  return (
    <>
      <li className={styles.card} key={element.id}>
        <div className={styles.closeButtonContainer}>
          <button
            className={styles.closeButton}
            onClick={() => setModalVisible(true)}
          >
            &#10005;
          </button>
        </div>

        <img
          className={styles.productImages}
          src={element.profileImage}
          alt={element.title || 'No title available'}
          onClick={handleButtonClick}
        />
        <p className={styles.productTitle}>{element.title}</p>
        <div className={styles.productInfoContainer}>
          <div className={styles.priceContainer}>
            {element.hasDiscount ? (
              <>
                <p className={styles.oldPrice}>{element.price}₴</p>
                <p className={styles.productPrice}>{element.newPrice}₴</p>
              </>
            ) : (
              <p className={styles.productPrice}>{element.price}₴</p>
            )}
          </div>
          <p className={styles.productSource}>Source: {element.source}</p>
          <p className={styles.productType}>{element.type}</p>
        </div>

      </li>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
        title="Are you sure want to delete this product?"
      >
      </Modal>
    </>
  );
};
