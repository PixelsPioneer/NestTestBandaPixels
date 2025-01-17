import React, { useState, useEffect } from 'react';
import './App.css';
import  {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Api } from './components/Api.component';
import { Header } from './components/Header.component';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDarkTheme(theme === 'dark');
    localStorage.setItem('theme', theme);
  };

  const toggleComponent = (componentName: string) => {};

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  return (
    <div className="App">
      <Header
        toggleComponent={toggleComponent}
        setTheme={setTheme}
        isDarkTheme={isDarkTheme}
      />
      <Api />
      <ToastContainer />
    </div>
  );
}

export default App;
