import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from './components/Api.component';
import { Header } from './components/Header.component';
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App">
      <Header toggleTheme={toggleTheme} theme={theme} />
      <Api />
      <ToastContainer />
    </div>
  );
}

export default App;
