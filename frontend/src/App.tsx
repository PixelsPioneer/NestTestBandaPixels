import React, { useEffect } from 'react';
import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import './App.css';
import { TokenProvider, useTokenContext } from './context/TokenContext';
import { CartProvider } from './context/cartContext';
import { Header } from './header/Header.component';
import { useTheme } from './hooks/useTheme';
import { AuthModal } from './modalWindow/AuthModal';
import { ProductsComponent } from './product/Products.component';
import { ProductPage } from './productPages/productPage.component';
import { SignOut } from './signOut/SignOut.component';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { accessToken } = useTokenContext();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!accessToken);
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    setIsAuthModalOpen(!accessToken);
  }, [accessToken]);

  return (
    <div className={`App ${theme}`}>
      <AuthModal isOpen={isAuthModalOpen} isSignIn={isSignIn} />
      <Header
        toggleTheme={toggleTheme}
        theme={theme}
        onSignIn={() => setIsAuthModalOpen(true)}
        onSignUp={() => {
          setIsSignIn(false);
          setIsAuthModalOpen(true);
        }}
      />
      <Routes>
        <Route path="/" element={<ProductsComponent />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signout" element={<SignOut />} />
      </Routes>
      <ToastContainer limit={3} />
    </div>
  );
}

function App() {
  return (
    <TokenProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </TokenProvider>
  );
}

export default App;
