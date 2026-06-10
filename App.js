import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext.js';
import { AuthProvider } from './src/context/AuthContext.js';
import { CartProvider } from './src/context/CartContext.js';
import Routes from './src/routes/index.js';
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="light" />
            <Routes />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>

  );
}