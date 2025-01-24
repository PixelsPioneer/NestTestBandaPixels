import { useEffect, useState } from 'react';

import { Themes } from '../constants/constants';

export function useTheme() {
  const getTheme = (): Themes => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', Themes.LIGHT);
      return Themes.LIGHT;
    }
    return savedTheme === Themes.DARK ? Themes.DARK : Themes.LIGHT;
  };

  const [theme, setTheme] = useState<Themes>(getTheme);

  const toggleTheme = () => {
    const newTheme = theme === Themes.DARK ? Themes.LIGHT : Themes.DARK;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === Themes.DARK);
    document.body.classList.toggle('light-theme', theme === Themes.LIGHT);
  }, [theme]);

  return { theme, toggleTheme };
}
