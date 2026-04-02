import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    // 앱 시작 시 초기 상태 1회 확인
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(!!(state.isConnected && state.isInternetReachable));
      setLastChecked(new Date());
    });

    // 이후 변경 감지
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(!!(state.isConnected && state.isInternetReachable));
      setLastChecked(new Date());
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, lastChecked };
}
