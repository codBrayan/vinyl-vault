import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ProductScreen from '../screens/app/ProductScreen.js';
import HomeScreen from '../screens/app/HomeScreen.js';
import CartScreen from '../screens/app/CartScreen.js';
import ProfileScreen from '../screens/app/ProfileScreen.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function TabRoutes() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#120F0D', 
          borderTopColor: '#1A1613', 
          height: 85,  
        },
        tabBarActiveTintColor: '#C6734B', 
        tabBarInactiveTintColor: '#5A524C'  
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ) 
        }} 
      />
      <Tab.Screen 
        name="Carrinho" 
        component={CartScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ) 
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ) 
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRoutes} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
    </Stack.Navigator>
  );
}