import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Themes } from '../constants/constants';
import { AuthModal } from '../modalWindow/AuthModal';
import { useTokenContext } from '../tokenContext/TokenContext';
import styles from './header.module.css';

interface HeaderProps {
  toggleTheme: () => void;
  theme: Themes;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { token } = useTokenContext();
  const navigate = useNavigate();
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

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleSignOut = () => {
    navigate('/signout');
  };

  const handleProduct = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Scraper</div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {!token && (
            <li className={styles.navItem}>
              <button onClick={() => openAuthModal(true)} className={styles.AuthButton}>
                Auth
              </button>
            </li>
          )}
          {token && (
            <li className={styles.navItem}>
              <button onClick={handleProduct} className={styles.productButton}>
                Product
              </button>
              <button onClick={handleSignOut} className={styles.signOutButton}>
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

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} isSignIn={isSignIn} />
    </header>
  );
};
