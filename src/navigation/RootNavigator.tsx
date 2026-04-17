import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuthStore } from '../store';
import PushHandler from '../components/PushHandler';
import IntroScreen from '../screens/auth/IntroScreen';

// RootNavigator.tsx
export default function RootNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, [isHydrated]);

  if (showIntro) {
    return <IntroScreen />;
  }

  return (
    <NavigationContainer>
      <PushHandler />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
