import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { Header } from './header/Header.component';
import { useTheme } from './hooks/useTheme';
import { ProductsComponent } from './product/Products.component';
import { SignIn } from './signIn/SingIn.component';
import { SignOut } from './signOut/SignOut.component';
import { Signup } from './signUp/SignUp.component';
import { TokenProvider } from './tokenContext/TokenContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TokenProvider>
      <Router>
        <div className={`App ${theme}`}>
          <Header toggleTheme={toggleTheme} theme={theme} />
          <Routes>
            <Route path="/" element={<ProductsComponent />} />
            <Route path="/signup" element={<Signup />} />
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
