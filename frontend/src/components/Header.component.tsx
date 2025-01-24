import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Themes } from '../constants/constants';
import { useTokenContext } from './TokenContext';
import styles from './header.module.css';

interface HeaderProps {
  toggleTheme: () => void;
  theme: Themes;
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { token } = useTokenContext();
  const [currentTheme, setCurrentTheme] = useState<Themes>(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>My App</div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>
              Products
            </Link>
          </li>
          {!token && (
            <li className={styles.navItem}>
              <Link to="/signin" className={styles.navLink}>
                Sign In
              </Link>
            </li>
          )}
          {token && (
            <li className={styles.navItem}>
              <Link to="/signout" className={styles.navLink}>
                Sign Out
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className={styles['theme-toggle-container']} onClick={toggleTheme}>
        <div className={`${styles['theme-toggle']} ${currentTheme === Themes.DARK ? styles.dark : styles.light}`}>
          <span className={styles.label}>{Themes.LIGHT}</span>
          <span className={styles.label}>{Themes.DARK}</span>
          <div className={styles.slider}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
