import React, { ReactNode, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import styles from './carousel.module.css';

interface CarouselProps {
  children: ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const totalSlides = React.Children.count(children);
  const maxDots = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleDots = () => {
    if (totalSlides <= maxDots) return [...Array(totalSlides).keys()];

    let start = Math.min(Math.max(0, currentIndex - Math.floor(maxDots / 2)), totalSlides - maxDots);
    return [...Array(maxDots).keys()].map(i => i + start);
  };

  const visibleDots = getVisibleDots();

  const carouselSettings: Settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: handleSlideChange,
    customPaging: (i: number) => (
      <button
        className={`${styles.dot} ${visibleDots.includes(i) ? styles.activeDot : ''}`}
        onClick={() => setCurrentIndex(i)}>
        {i + 1}
      </button>
    ),
    dotsClass: `slick-dots ${styles.customDots}`,
    appendDots: (dots: React.ReactNode[]) => (
      <div className={styles.dotsContainer}>
        <ul>{dots.filter((_, i) => visibleDots.includes(i))}</ul>
      </div>
    ),
  };

  return (
    <Slider {...carouselSettings} className={styles.carousel}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={styles.ImgContainer}>
          {child}
        </div>
      ))}
    </Slider>
  );
};
