import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { BASE_URL } from '../../api/util';
import { useAuthStore } from '../../store';
import { getMeApi } from '../../api/auth';

export default function IntroScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const { isAuthenticated, token, setAuth, isHydrated } = useAuthStore();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // hydration 완료 후에 계정 정보 갱신 (타이밍 보장)
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !token) return;
    getMeApi(token)
      .then(({ user }) => setAuth(user, token, user.office))
      .catch(() => {
        // API 실패 시 캐시된 정보 유지 (로그아웃 X)
      });
  }, [isHydrated]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: BASE_URL + '/images/app_logo.png' }}
        style={{ width: 220, height: 56, resizeMode: 'contain' }}
      />
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  barTrack: {
    width: 180,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
