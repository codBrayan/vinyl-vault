import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext.js';
import AuthRoutes from './AuthRoutes.js';
import AppRoutes from './AppRoutes.js';

export default function Routes() {
  const { usuario, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}