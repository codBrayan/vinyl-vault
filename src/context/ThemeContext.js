import React, { createContext, useState } from 'react';

export const themes = {
  dark: {
    type: 'dark',
    background: '#120F0D',       // O preto aquecido/marrom escuro de fundo
    surface: '#1A1613',          // O fundo dos cards e inputs escuros
    text: '#FFFFFF',             // Texto principal branco
    textSecondary: '#8E8680',    // Subtítulos e dados secundários cinza-brown
    primary: '#C6734B',          // O Laranja Terracota dos botões principais
    border: '#2C2521',           // Bordas sutis integradas ao fundo
    loginBg: '#F9EFEA',          // O fundo creme/off-white exclusivo da tela de login
    loginInput: '#F5E6DF',       // O fundo levemente mais escuro dos inputs do login
    loginText: '#4A3B32',        // Texto escuro para a tela de login
  },
  // Mantemos a estrutura caso precise futuramente
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