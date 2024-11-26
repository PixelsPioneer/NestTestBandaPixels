import type { Element } from '../interfaces/Element.component';
import { FC } from 'react';
import styles from './product-list.module.css';

export interface CardProps {
    element: Element;
}

export const Card: FC<CardProps> = ({ element }) => {
    const handleButtonClick = () => {
        if (element.subtitle) {
            window.open(element.subtitle, '_blank');
        } else {
            console.error("No subtitle link available");
        }
    };

    return (
        <li className={styles.card} key={element.id}>
            <img
                className={styles.productImages}
                src={element.profileImage}
                alt={element.title || 'No title available'}
            />
            <p className={styles.productTitle}>{element.title}</p>
            <div className={styles.productInfoContainer}>
                <p className={styles.productPrice}>{element.newPrice}₴</p>
                <p className={styles.productSource}>Source: {element.source}</p>
                <p className={styles.productType}>{element.type}</p>
                <div className={styles.goToCardContainer}>
                    <button
                        className={styles.goToCardButton}
                        onClick={handleButtonClick}
                    >
                        Go to Product Page
                    </button>
                </div>
            </div>
        </li>
    );
};
