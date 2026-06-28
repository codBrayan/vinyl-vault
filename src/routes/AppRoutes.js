import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext.js";
import { AuthContext } from "../context/AuthContext.js";
import { View, Text } from "react-native";

import HomeScreen from "../screens/app/HomeScreen.js";
import CartScreen from "../screens/app/CartScreen.js";
import ProfileScreen from "../screens/app/ProfileScreen.js";
import ProductScreen from "../screens/app/ProductScreen.js";
import CreateProductScreen from "../screens/app/CreateProductScreen.js";
import EditProductScreen from "../screens/app/EditProductScreen.js";
import FavoritesScreen from "../screens/app/FavoritesScreen.js";
import UserOrdersScreen from "../screens/app/UserOrdersScreen.js";
import AdminOrderScreen from "../screens/app/AdminOrderScreen.js";
import DeletedProductsScreen from "../screens/app/DeletedProductsScreen.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function TabRoutes() {
  const { theme } = useContext(ThemeContext);
  const { isAdmin } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.type === "dark" ? "#120F0D" : "#EBE0DA",
          borderTopColor: theme.type === "dark" ? "#1A1613" : "#bb9e8f",
          height: 85,
        },
        tabBarActiveTintColor: "#C6734B",
        tabBarInactiveTintColor: "#5A524C",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {isAdmin ? (
        <Tab.Screen
          name="Pedidos"
          component={AdminOrderScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Carrinho"
          component={CartScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" color={color} size={size} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
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
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="UserOrders" component={UserOrdersScreen} />
      <Stack.Screen name="DeletedProducts" component={DeletedProductsScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
