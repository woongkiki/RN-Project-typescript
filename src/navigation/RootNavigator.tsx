import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuthStore } from '../store';
import PushHandler from '../components/PushHandler';
import IntroScreen from '../screens/auth/IntroScreen';
import AppUpdateModal from '../components/AppUpdateModal';
import { APP_VERSION, BASE_URL2 } from '../api/util';

/** semver 비교: server 버전이 current보다 높으면 true */
function isOutdated(current: string, server: string): boolean {
  const parse = (v: string) => v.split('.').map(n => parseInt(n, 10) || 0);
  const [cMaj, cMin, cPat] = parse(current);
  const [sMaj, sMin, sPat] = parse(server);
  if (sMaj !== cMaj) return sMaj > cMaj;
  if (sMin !== cMin) return sMin > cMin;
  return sPat > cPat;
}

// RootNavigator.tsx
export default function RootNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const [showIntro, setShowIntro] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, [isHydrated]);

  useEffect(() => {
    fetch(`${BASE_URL2}/api/app/version`)
      .then(res => res.json())
      .then(json => {
        const serverVersion: string = json?.data?.version ?? '';
        if (serverVersion && isOutdated(APP_VERSION, serverVersion)) {
          setLatestVersion(serverVersion);
          setUpdateModalVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  if (showIntro) {
    return <IntroScreen />;
  }

  return (
    <NavigationContainer>
      <PushHandler />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      <AppUpdateModal
        visible={updateModalVisible}
        latestVersion={latestVersion}
        onClose={() => setUpdateModalVisible(false)}
      />
    </NavigationContainer>
  );
}
