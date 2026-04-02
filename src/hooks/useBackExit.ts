// src/hooks/useBackExit.ts
import { useCallback, useRef } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export function useBackExit() {
  const backPressedOnce = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const onBackPress = () => {
        if (backPressedOnce.current) {
          // 두 번째 누름 → 앱 종료
          BackHandler.exitApp();
          return true;
        }

        backPressedOnce.current = true;

        Alert.alert(
          '앱 종료',
          '앱을 종료하시겠습니까?',
          [
            {
              text: '취소',
              onPress: () => {
                backPressedOnce.current = false;
                if (timerRef.current) clearTimeout(timerRef.current);
              },
              style: 'cancel',
            },
            {
              text: '종료',
              onPress: () => BackHandler.exitApp(),
              style: 'destructive',
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              backPressedOnce.current = false;
            },
          },
        );

        // 3초 후 초기화 (Alert 무시하고 다시 누를 경우 대비)
        timerRef.current = setTimeout(() => {
          backPressedOnce.current = false;
        }, 3000);

        return true; // 기본 뒤로가기 막기
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
        if (timerRef.current) clearTimeout(timerRef.current);
        backPressedOnce.current = false;
      };
    }, []),
  );
}
