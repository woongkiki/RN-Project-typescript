import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import FirstLoginScreen from '../screens/auth/FirstLoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// AuthNavigator.tsx
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthScreen" component={LoginScreen} />
      <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
    </Stack.Navigator>
  );
}
