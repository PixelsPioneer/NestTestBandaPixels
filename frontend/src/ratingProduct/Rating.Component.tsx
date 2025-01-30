import React from 'react';

import styles from './rating.module.css';

interface RatingStarsProps {
  rating: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className={styles.ratingProductContainer}>
      <div className={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => {
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
      <span className={styles.ratingText}>{rating.toFixed(1)}</span>
    </div>
  );
};
