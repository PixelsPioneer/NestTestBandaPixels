import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { Header } from './components/Header.component';
import { ProductsComponent } from './components/Products.component';
import { SignOut } from './components/SignOut.component';
import { SignIn } from './components/SingIn.component';
import { TokenProvider } from './components/TokenContext';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TokenProvider>
      <Router>
        <div className={`App ${theme}`}>
          <Header toggleTheme={toggleTheme} theme={theme} />
          <Routes>
            <Route path="/" element={<ProductsComponent />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
          <ToastContainer limit={3} />
        </div>
      </Router>
    </TokenProvider>
  );
}

export default App;
