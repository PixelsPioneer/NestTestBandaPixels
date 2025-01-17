import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from './components/Api.component';
import { Header } from './components/Header.component';

enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

function App() {
  const [theme, setTheme] = useState<Themes>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === Themes.DARK ? Themes.DARK : Themes.LIGHT;
  });

  const toggleTheme = () => {
    const newTheme = theme === Themes.DARK ? Themes.LIGHT : Themes.DARK;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (theme === Themes.DARK) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <div className="App">
      <Header toggleTheme={toggleTheme} isDarkTheme={theme === Themes.DARK} />
      <Api />
      <ToastContainer />
    </div>
  );
}

export default App;
