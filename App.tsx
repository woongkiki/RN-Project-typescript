// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import NoInternetScreen from './src/components/NoInternetScreen';
import { useAuthStore } from './src/store'; // ← 추가
import { KeyboardProvider } from 'react-native-keyboard-controller';

function AppContent() {
  const { isConnected, lastChecked } = useNetworkStatus();
  const isHydrated = useAuthStore(state => state.isHydrated); // ← 추가

  // AsyncStorage 복원 완료 전 렌더링 방지
  if (!isHydrated) return null;

  if (!isConnected) {
    return <NoInternetScreen lastChecked={lastChecked} />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider statusBarTranslucent={false}>
        <AppContent />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
