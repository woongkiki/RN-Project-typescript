import React, { useEffect, useRef, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { cancelSeminar, getSeminarPost, registerSeminar } from '../../api/board';
import { SeminarPost } from '../../types';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

type Props = NativeStackScreenProps<MainStackParamList, 'SeminarInfo'>;

const toDatetime = (iso: string) => {
  const d = new Date(iso);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${days[d.getDay()]}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const toDeadline = (iso: string) => {
  const d = new Date(iso);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${days[d.getDay()]}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}까지`;
};

export default function SeminarInfo({ route, navigation }: Props) {
  const { idx } = route.params;

  const [seminar, setSeminar] = useState<SeminarPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [webViewHeight, setWebViewHeight] = useState(200);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const measureScript = `
    (function() {
      function sendHeight() {
        var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        window.ReactNativeWebView.postMessage(h.toString());
      }
      sendHeight();
      setTimeout(sendHeight, 300);
    })();
    true;
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    const height = Number(event.nativeEvent.data);
    if (!isNaN(height) && height > 0) setWebViewHeight(height);
  };

  const handleLoadEnd = () => {
    webViewRef.current?.injectJavaScript(
      `(function() {
        var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        window.ReactNativeWebView.postMessage(h.toString());
      })(); true;`
    );
  };

  useEffect(() => {
    getSeminarPost(Number(idx))
      .then(data => {
        setSeminar(data);
        setIsRegistered(data.isRegistered);
      })
      .catch(() => Alert.alert('오류', '세미나 정보를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [idx]);

  const handleRegister = () => {
    Alert.alert('세미나 신청', '이 세미나를 신청하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '신청',
        onPress: async () => {
          setActionLoading(true);
          try {
            await registerSeminar(Number(idx));
            setIsRegistered(true);
            setSeminar(prev =>
              prev ? { ...prev, registeredCount: prev.registeredCount + 1 } : prev,
            );
            Alert.alert('완료', '세미나 신청이 완료되었습니다.');
          } catch (e: any) {
            Alert.alert('오류', e?.message ?? '신청에 실패했습니다.');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('신청 취소', '세미나 신청을 취소하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      {
        text: '취소하기',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          try {
            await cancelSeminar(Number(idx));
            setIsRegistered(false);
            setSeminar(prev =>
              prev ? { ...prev, registeredCount: Math.max(0, prev.registeredCount - 1) } : prev,
            );
            Alert.alert('완료', '세미나 신청이 취소되었습니다.');
          } catch (e: any) {
            Alert.alert('오류', e?.message ?? '취소에 실패했습니다.');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Layout>
        <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* 상태 뱃지 */}
          <View style={{ alignItems: 'flex-start', marginBottom: 15 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                backgroundColor: seminar?.isFull ? colors.gray1 : colors.primary3,
              }}
            >
              <CommonText
                labelText={seminar?.isFull ? '정원마감' : '모집중'}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 14, color: seminar?.isFull ? colors.gray6 : colors.primary },
                ]}
              />
            </View>
          </View>

          {/* 제목 */}
          <CommonText
            labelText={seminar?.title ?? ''}
            labelTextStyle={[fonts.semiBold, { fontSize: 20, color: colors.gray10 }]}
          />

          {/* 세미나 정보 */}
          <View style={{ gap: 30, marginTop: 20, borderBottomWidth: 1, borderBottomColor: colors.gray1, paddingBottom: 20 }}>
            <View>
              <CommonText labelText="일시" labelTextStyle={[styles.label]} />
              <CommonText
                labelText={seminar ? `${toDatetime(seminar.startAt)} ~ ${toDatetime(seminar.endAt)}` : ''}
                labelTextStyle={[styles.contents]}
              />
            </View>
            <View>
              <CommonText labelText="신청기한" labelTextStyle={[styles.label]} />
              <CommonText
                labelText={seminar ? toDeadline(seminar.deadline) : ''}
                labelTextStyle={[styles.contents]}
              />
            </View>
            <View>
              <CommonText labelText="모집인원" labelTextStyle={[styles.label]} />
              <CommonText
                labelText={seminar ? `${seminar.capacity}명 (신청 ${seminar.registeredCount}명)` : ''}
                labelTextStyle={[styles.contents]}
              />
            </View>
          </View>
        </View>

        {/* 세미나 소개 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <CommonText labelText="세미나 정보" labelTextStyle={[fonts.semiBold, { color: colors.gray10 }]} />
          <WebView
            ref={webViewRef}
            style={{ marginTop: 15, height: webViewHeight }}
            originWhitelist={['*']}
            scrollEnabled={false}
            source={{
              html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{margin:0;padding:0;font-family:-apple-system,sans-serif;font-size:15px;color:#444;line-height:1.6}img{max-width:100%;height:auto}</style></head><body>${seminar?.description ?? ''}</body></html>`,
            }}
            injectedJavaScript={measureScript}
            onMessage={handleMessage}
            onLoadEnd={handleLoadEnd}
          />
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.gray1 }}>
        {isRegistered ? (
          <TouchableOpacity
            disabled={actionLoading}
            onPress={handleCancel}
            style={{
              height: 52,
              borderRadius: 30,
              borderWidth: 1.5,
              borderColor: colors.primary,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CommonText
              labelText={actionLoading ? '처리중...' : '신청 취소'}
              labelTextStyle={[fonts.semiBold, { fontSize: 16, color: colors.primary }]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={seminar?.isFull || actionLoading}
            onPress={handleRegister}
            style={{
              height: 52,
              borderRadius: 30,
              backgroundColor: seminar?.isFull ? colors.gray3 : colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CommonText
              labelText={actionLoading ? '처리중...' : seminar?.isFull ? '정원마감' : '신청하기'}
              labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
            />
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray7 },
  contents: { fontSize: 16, color: colors.gray9, ...fonts.medium, marginTop: 12 },
});
