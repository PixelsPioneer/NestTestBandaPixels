import React, { useState, useEffect } from 'react';
import styles from './header.module.css';
import { Themes } from '../constants/constants';

interface HeaderProps {
  toggleTheme: () => void;
  theme: Themes;
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const [currentTheme, setCurrentTheme] = useState<Themes>(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>My App</div>
      <div className={styles['theme-toggle-container']} onClick={handleToggleTheme}>
        <div
          className={`${styles['theme-toggle']} ${currentTheme === Themes.DARK ? styles.dark : styles.light}`}
        >
          <span className={styles.label}>{Themes.LIGHT}</span>
          <span className={styles.label}>{Themes.DARK}</span>
          <div className={styles.slider}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
