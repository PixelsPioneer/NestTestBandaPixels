import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Themes } from '../constants/constants';
import { useTokenContext } from '../context/TokenContext';
import { useCartContext } from '../context/cartContext';
import CartIconWithDropdown from '../icons/cartIcon';
import { AuthModal } from '../modalWindow/AuthModal';
import styles from './header.module.css';

interface HeaderProps {
  toggleTheme: () => void;
  theme: Themes;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { accessToken } = useTokenContext();
  const navigate = useNavigate();
  const { cartCount } = useCartContext(); // 🔹 Отримуємо кількість товарів у кошику
  const [currentTheme, setCurrentTheme] = useState<Themes>(theme);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const openAuthModal = (signIn: boolean) => {
    setIsSignIn(signIn);
    setIsAuthModalOpen(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Scraper</div>

      <div className={styles.cartContainer}>
        <CartIconWithDropdown />
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {accessToken && (
            <li className={styles.navItem}>
              <button onClick={() => navigate('/')} className={styles.productButton}>
                Product
              </button>
              <button onClick={() => navigate('/signout')} className={styles.signOutButton}>
                Sign Out
              </button>
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

      <AuthModal isOpen={isAuthModalOpen} isSignIn={isSignIn} />
    </header>
  );
};
