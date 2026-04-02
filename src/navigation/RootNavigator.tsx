import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuthStore } from '../store';
import PushHandler from '../components/PushHandler';

// RootNavigator.tsx
export default function RootNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <NavigationContainer>
      <PushHandler />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
