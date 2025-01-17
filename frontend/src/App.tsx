import React, { useState, useEffect } from 'react';
import './App.css';
import  {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Api } from './components/Api.component';
import { Header } from './components/Header.component';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <div className="App">
      <Header
        toggleTheme={toggleTheme}
        isDarkTheme={theme === 'dark'}
      />
      <Api />
      <ToastContainer />
    </div>
  );
}

export default App;
