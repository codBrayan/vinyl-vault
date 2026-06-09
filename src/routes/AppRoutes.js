import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/app/HomeScreen.js';
import CartScreen from '../screens/app/CartScreen.js';
import ProfileScreen from '../screens/app/ProfileScreen.js';

const Tab = createBottomTabNavigator();

export default function AppRoutes() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#120F0D', 
          borderTopColor: '#1A1613', 
          height: 85,          
          paddingBottom: 20,   
          paddingTop: 10
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