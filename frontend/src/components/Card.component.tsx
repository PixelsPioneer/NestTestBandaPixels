import { FC, useState } from 'react';
import { Element } from '../interfaces/Element.component';
import { Modal } from './Modal.component';
import axios from 'axios';
import styles from './product-list.module.css';
import { toastError} from './ToastNotification.component';

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
      toastError("No subtitle link available");
    }
  };

  const handleDelete = async () => {
    setModalVisible(false);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/product/${element.id}`
      );
      if (!response || response.status !== 200) {
        toastError('Failed to delete product. Please try again.');
        return;
      }
      onDelete();
    } catch (error) {
      toastError('Error deleting product');
      return;
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
