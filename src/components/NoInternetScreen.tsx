import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

interface Props {
  onRetry?: () => void;
  lastChecked?: Date;
}

export default function NoInternetScreen({ onRetry, lastChecked }: Props) {
  const openWifiSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:WIFI');
    } else {
      Linking.sendIntent('android.settings.WIFI_SETTINGS');
    }
  }, []);

  const openMobileDataSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:General');
    } else {
      Linking.sendIntent('android.settings.DATA_ROAMING_SETTINGS');
    }
  }, []);

  const handleRetry = useCallback(async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected && state.isInternetReachable) {
      onRetry?.();
    }
  }, [onRetry]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f14" />

      {/* 아이콘 */}
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          {/* 여기에 SVG 아이콘 라이브러리(react-native-svg) 사용 권장 */}
          <Text style={styles.iconEmoji}>📡</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>!</Text>
        </View>
      </View>

      {/* 타이틀 */}
      <Text style={styles.title}>인터넷 연결 없음</Text>
      <Text style={styles.subtitle}>
        {'Wi-Fi 또는 모바일 데이터를 확인하고\n다시 시도해 주세요'}
      </Text>

      {/* 설정 버튼들 */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={openWifiSettings}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.settingIcon,
              { backgroundColor: 'rgba(83,74,183,0.2)' },
            ]}
          >
            <Text style={styles.settingIconText}>📶</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Wi-Fi 설정 열기</Text>
            <Text style={styles.settingDesc}>무선 네트워크 설정</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={openMobileDataSettings}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.settingIcon,
              { backgroundColor: 'rgba(29,158,117,0.2)' },
            ]}
          >
            <Text style={styles.settingIconText}>📱</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>모바일 데이터 설정</Text>
            <Text style={styles.settingDesc}>셀룰러 네트워크 설정</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 재시도 버튼 */}
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleRetry}
        activeOpacity={0.85}
      >
        <Text style={styles.retryText}>다시 시도</Text>
      </TouchableOpacity>

      {lastChecked && (
        <Text style={styles.lastChecked}>
          마지막 확인: {lastChecked.toLocaleTimeString('ko-KR')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconWrapper: {
    marginBottom: 32,
    position: 'relative',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(83,74,183,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(83,74,183,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E24B4A',
    borderWidth: 2,
    borderColor: '#0f0f14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 36,
  },
  settingsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 28,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconText: {
    fontSize: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDesc: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
  },
  chevron: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 20,
    fontWeight: '300',
  },
  retryButton: {
    width: '100%',
    backgroundColor: '#534AB7',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  lastChecked: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    marginTop: 16,
  },
});
