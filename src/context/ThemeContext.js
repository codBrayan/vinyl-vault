import React, { createContext, useState } from 'react';

export const themes = {
  dark: {
    type: 'dark',
    background: '#120F0D',
    surface: '#1A1613',
    text: '#FFFFFF',
    textSecondary: '#8E8680',
    primary: '#C6734B',
    border: '#2C2521',
    loginBg: '#F9EFEA',
    loginInput: '#F5E6DF',
    loginText: '#4A3B32',
  },

  light: {
    type: 'light',
    background: '#F9EFEA',
    surface: '#FFFFFF',
    text: '#4A3B32',
    textSecondary: '#8E8680',
    primary: '#C6734B',
    border: '#EBE0DA',
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.dark); 

  const toggleTheme = () => {
    setTheme(prev => prev.type === 'dark' ? themes.light : themes.dark);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};