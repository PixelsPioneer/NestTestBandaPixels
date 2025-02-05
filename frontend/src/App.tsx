import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import './App.css';
import { Header } from './header/Header.component';
import { useTheme } from './hooks/useTheme';
import { AuthModal } from './modalWindow/AuthModal';
import { ProductsComponent } from './product/Products.component';
import { ProductPage } from './productPages/productPage.component';
import { SignOut } from './signOut/SignOut.component';
import { TokenProvider, useTokenContext } from './tokenContext/TokenContext';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { token } = useTokenContext();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isSignIn, setIsSignIn] = React.useState(true);

  useEffect(() => {
    if (!token) {
      setIsAuthModalOpen(true);
    }
  }, [token]);

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <div className={`App ${theme}`}>
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
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} isSignIn={isSignIn} />
    </div>
  );
}

function App() {
  return (
    <TokenProvider>
      <Router>
        <AppContent />
      </Router>
    </TokenProvider>
  );
}

export default App;
