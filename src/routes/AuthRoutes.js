import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen.js';

const RegisterMock = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' }}><Text style={{ color: '#fff' }}>Tela de Registro (Em breve)</Text></View>;

const Stack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} /> 
      <Stack.Screen name="Register" component={RegisterMock} />
    </Stack.Navigator>
  );
}