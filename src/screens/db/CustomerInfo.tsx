import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SubHeader from '../../components/SubHeader';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { BASE_URL } from '../../api/util';
import CommonInput from '../../components/CommonInput';
import { useAuthStore } from '../../store';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AudioPlayer from '../../components/AudioPlayer';

type Props = NativeStackScreenProps<MainStackParamList, 'CustomerInfo'>;

const PROGRESS_STATUSES = [
  '상담접수',
  '통화부재',
  '통화거절',
  '재통화예정',
  '미팅예정',
  '재미팅예정',
  '미팅완료',
  '청약진행중',
  '청약완료',
  '인수거절',
  '미팅취소',
];

// ✅ StatusModal 내부 콘텐츠 (SafeAreaProvider 안에서 insets 사용)
const StatusModalContent = ({
  visible,
  onClose,
  progressStatus,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  progressStatus: string;
  onSelect: (status: string) => void;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom,
          // ✅ 최대 높이 제한으로 스크롤 가능하게
          maxHeight: '70%',
        }}
      >
        {/* 헤더 */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.gray3,
              marginBottom: 12,
            }}
          />
          <CommonText
            labelText="진행 상태 선택"
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 18, color: colors.gray10 },
            ]}
          />
        </View>

        {/* ✅ 상태 목록 스크롤 */}
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {PROGRESS_STATUSES.map((status, index) => (
            <TouchableOpacity
              key={status}
              onPress={() => {
                onSelect(status);
                onClose();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < PROGRESS_STATUSES.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray1,
                backgroundColor:
                  progressStatus === status ? colors.primary3 : colors.white,
              }}
            >
              <CommonText
                labelText={status}
                labelTextStyle={[
                  fonts.medium,
                  { fontSize: 16 },
                  progressStatus === status && {
                    color: colors.primary,
                    ...fonts.semiBold,
                  },
                ]}
              />
              {progressStatus === status && (
                <Image
                  source={{ uri: BASE_URL + '/images/check_icon_blue.png' }}
                  style={{ width: 16, height: 16, resizeMode: 'contain' }}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// ✅ MemoModal 내부 콘텐츠
const MemoModalContent = ({
  memoText,
  onChangeText,
  onClose,
  onSave,
}: {
  memoText: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, justifyContent: 'flex-end' }}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}
          >
            <CommonText
              labelText="메모 작성"
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 18, color: colors.gray10 },
              ]}
            />
            <TouchableOpacity onPress={onClose}>
              <Image
                source={{ uri: BASE_URL + '/images/close_icon.png' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>

          <CommonInput
            value={memoText}
            onChangeText={onChangeText}
            placeholder={'메모를 입력하세요.'}
            multiline
            textAlignVertical="top"
            placeholderTextColor={colors.gray5}
            inputStyle={{
              borderWidth: 1,
              borderColor: colors.gray3,
              borderRadius: 8,
              padding: 15,
              fontSize: 15,
              color: colors.gray9,
              height: 200,
              ...fonts.regular,
              backgroundColor: colors.white,
            }}
          />

          <TouchableOpacity
            onPress={onSave}
            style={{
              marginTop: 15,
              height: 52,
              borderRadius: 30,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CommonText
              labelText="저장"
              labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default function CustomerInfo({ route, navigation }: Props) {
  const { idx } = route.params;

  const { top } = useSafeAreaInsets();
  const { width } = useAppDimensions();

  const user = useAuthStore(state => state.user);

  const [tooltipModal, setTooltipModal] = useState(false);
  const [memoModal, setMemoModal] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [savedMemo, setSavedMemo] = useState(
    '홍길동\n770723\n고객이 문자가 아닌 전화 통화를 선호함\n가족점검 요청\n빠른 통화 원함',
  );
  const [progressStatus, setProgressStatus] = useState('상담접수');
  const [statusModal, setStatusModal] = useState(false);

  return (
    <Layout
      scrollable={true}
      scrollViewStyle={{ backgroundColor: colors.gray1 }}
      scrollViewContentStyle={{ padding: 20, paddingBottom: 0 }}
      headerChildren={
        <SubHeader
          headerLabel="고객 상세 정보"
          headerLeftOnPress={() => navigation.goBack()}
          headerRightVisible={true}
          headerRightContent={
            <TouchableOpacity
              onPress={() => setTooltipModal(true)}
              style={{
                width: '100%',
                height: '100%',
                paddingRight: 10,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/dot_menu_icon.png' }}
                style={{ width: 3, height: 17, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          }
        />
      }
    >
      <View style={[styles.infoWrap, { marginBottom: 15 }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
          }}
        >
          <View style={{ gap: 16, width: width - 120 }}>
            <CommonText
              labelText="홍길동"
              style={[fonts.semiBold, { color: colors.gray10, fontSize: 22 }]}
            />
            <CommonText
              labelText="010-1234-5678"
              style={[fonts.regular, { color: colors.gray7, fontSize: 14 }]}
            />
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:010-1234-5678`)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#EEF1F5',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              shadowColor: 'rgba(174, 187, 196, 0.2)',
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 3,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: BASE_URL + '/images/phon_icon_blue.png' }}
              style={{ width: 16, height: 16, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image
              source={{ uri: BASE_URL + '/images/birthday_icon.png' }}
              style={{ width: 10, height: 10, resizeMode: 'contain' }}
            />
            <View style={{ width: width - 90 }}>
              <CommonText
                labelText="45세"
                labelTextStyle={[
                  fonts.regular,
                  { fontSize: 13, color: colors.gray9 },
                ]}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 7,
            }}
          >
            <Image
              source={{ uri: BASE_URL + '/images/job_icon.png' }}
              style={{ width: 10, height: 10, resizeMode: 'contain' }}
            />
            <View style={{ width: width - 90 }}>
              <CommonText
                labelText="IT엔지니어"
                labelTextStyle={[
                  fonts.regular,
                  { fontSize: 13, color: colors.gray9 },
                ]}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 7,
            }}
          >
            <Image
              source={{ uri: BASE_URL + '/images/address_icon_black.png' }}
              style={{ width: 10, height: 10, resizeMode: 'contain' }}
            />
            <View style={{ width: width - 90 }}>
              <CommonText
                labelText="서울특별시 구로구 구로동 000-00"
                labelTextStyle={[
                  fonts.regular,
                  { fontSize: 13, color: colors.gray9 },
                ]}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            marginTop: 15,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
          }}
        >
          <View style={[styles.optionWrap]}>
            <CommonText
              labelText="가족상담 신청"
              labelTextStyle={[styles.optionText]}
            />
          </View>
          <View
            style={[
              styles.optionWrap,
              {
                backgroundColor: colors.subGreen,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              },
            ]}
          >
            <CommonText
              labelText="보험료 100만"
              labelTextStyle={[styles.optionText, { color: '#10A43C' }]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/price_down_arr.png' }}
              style={{ width: 10, height: 7, resizeMode: 'contain' }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
          <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
            <CommonText labelText="DB종류" style={[styles.infoLabel]} />
            <CommonText labelText="테스트보험" style={[styles.infoText]} />
          </View>
          <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
            <CommonText labelText="등록 일시" style={[styles.infoLabel]} />
            <CommonText
              labelText="2021/12/32 14:25"
              style={[styles.infoText]}
            />
          </View>
          <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
            <CommonText labelText="담당 상담사" style={[styles.infoLabel]} />
            <CommonText labelText="홍길동 상담사" style={[styles.infoText]} />
          </View>
          <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
            <CommonText labelText="통화 희망일" style={[styles.infoLabel]} />
            <CommonText
              labelText="2022/01/01 오후"
              style={[styles.infoText, { color: colors.primary }]}
            />
          </View>
        </View>
        <View style={{ marginTop: 15, gap: 12 }}>
          <CommonText labelText="진행 상태" style={[styles.infoLabel]} />
          <TouchableOpacity
            onPress={() => setStatusModal(true)}
            style={{
              borderRadius: 8,
              padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: colors.gray3,
            }}
          >
            <CommonText
              labelText={progressStatus}
              style={[fonts.medium, { fontSize: 16 }]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
              style={{ width: 12, height: 8, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
        <CommonText
          labelText="상담 녹취"
          labelTextStyle={[fonts.medium, { fontSize: 14 }]}
        />
        <AudioPlayer
          url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // 샘플 URL
          title="상담 녹취"
          // 자막 싱크 추가 시 활용
          onPositionChange={position => {
            // 추후 자막 하이라이트 처리
            // console.log('position:', position);
          }}
        />
      </View>

      <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
        <View
          style={{
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ width: '100%' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                marginBottom: 10,
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/memo_icon.png' }}
                style={{ width: 14, height: 14, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 90 }}>
                <CommonText
                  labelText="상담사 메모"
                  labelTextStyle={[styles.labelText]}
                />
              </View>
            </View>
            <CommonText labelText="26.02.18" style={[styles.dateText]} />
          </View>
        </View>
        <View>
          <CommonText
            labelText={
              '홍길동\n770723\n고객이 문자가 아닌 전화 통화를 선호함\n가족점검 요청\n빠른 통화 원함'
            }
            labelTextStyle={[
              { fontSize: 15, lineHeight: 21, color: colors.gray9 },
            ]}
          />
        </View>
      </View>

      <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
        <View
          style={{
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ width: width - 160 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                marginBottom: 10,
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/memo_icon.png' }}
                style={{ width: 14, height: 14, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 180 }}>
                <CommonText
                  labelText="설계사 메모"
                  labelTextStyle={[styles.labelText]}
                />
              </View>
            </View>
            <CommonText labelText="26.02.18" style={[styles.dateText]} />
          </View>
          <TouchableOpacity
            onPress={() => {
              setMemoText(savedMemo);
              setMemoModal(true);
            }}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
              backgroundColor: colors.gray9,
              borderRadius: 6,
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: BASE_URL + '/images/pencil_icon_white.png' }}
              style={{ width: 12, height: 12, resizeMode: 'contain' }}
            />
            <CommonText
              labelText="메모작성"
              labelTextStyle={[{ fontSize: 12, color: '#fff' }, fonts.semiBold]}
            />
          </TouchableOpacity>
        </View>
        <View>
          <CommonText
            labelText={savedMemo}
            labelTextStyle={[
              { fontSize: 15, lineHeight: 21, color: colors.gray9 },
            ]}
          />
        </View>
      </View>

      {(user?.grade ?? 0) > 2 && (
        <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
          <View
            style={{
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ width: '100%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <Image
                  source={{ uri: BASE_URL + '/images/calendar_black.png' }}
                  style={{ width: 14, height: 14, resizeMode: 'contain' }}
                />
                <View style={{ width: width - 90 }}>
                  <CommonText
                    labelText="스케줄"
                    labelTextStyle={[styles.labelText]}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <CommonText
              labelText="홍길동님과 통화"
              style={[fonts.semiBold, { fontSize: 16, color: colors.gray10 }]}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CommonText
                labelText="2026.03.16"
                style={[fonts.regular, { fontSize: 12, color: colors.primary }]}
              />
              <View
                style={{
                  width: 1,
                  height: 8,
                  backgroundColor: colors.gray3,
                  marginHorizontal: 5,
                }}
              />
              <CommonText
                labelText="10:00 AM"
                style={[fonts.regular, { fontSize: 12, color: colors.primary }]}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 90 }}>
                <CommonText
                  labelText="서울특별시 구로구 구로동 000-00"
                  labelTextStyle={[
                    fonts.regular,
                    { fontSize: 13, color: colors.gray7 },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={[styles.mapWrap]}>
            <WebView
              source={{ uri: BASE_URL + '/map.html' }}
              style={{ flex: 1, borderRadius: 8 }}
              scrollEnabled={false}
              javaScriptEnabled
              userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            />
          </View>
        </View>
      )}

      {/* ✅ 진행 상태 모달 */}
      <Modal
        visible={statusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModal(false)}
      >
        <SafeAreaProvider>
          <StatusModalContent
            visible={statusModal}
            onClose={() => setStatusModal(false)}
            progressStatus={progressStatus}
            onSelect={status => setProgressStatus(status)}
          />
        </SafeAreaProvider>
      </Modal>

      {/* ✅ 툴팁 모달 (insets 직접 사용 - 위치 고정이라 SafeAreaProvider 불필요) */}
      <Modal
        visible={tooltipModal}
        transparent
        animationType="fade"
        onRequestClose={() => setTooltipModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          activeOpacity={1}
          onPress={() => setTooltipModal(false)}
        >
          <View
            style={{
              alignItems: 'flex-start',
              borderWidth: 1,
              borderRadius: 8,
              borderColor: colors.gray1,
              position: 'absolute',
              top: top + 58,
              right: 20,
              zIndex: 1,
              overflow: 'hidden',
              backgroundColor: colors.white,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 16,
                backgroundColor: colors.white,
              }}
            >
              <CommonText
                labelText="수정하기"
                labelTextStyle={[
                  fonts.medium,
                  { color: colors.gray10, fontSize: 14 },
                ]}
              />
              <Image
                source={{ uri: BASE_URL + '/images/pencil_icon_gray.png' }}
                style={{ width: 13, height: 13, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ✅ 메모 모달 */}
      <Modal
        visible={memoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setMemoModal(false)}
      >
        <SafeAreaProvider>
          <MemoModalContent
            memoText={memoText}
            onChangeText={setMemoText}
            onClose={() => setMemoModal(false)}
            onSave={() => {
              setSavedMemo(memoText);
              setMemoModal(false);
            }}
          />
        </SafeAreaProvider>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  infoWrap: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: 'rgba(175, 176, 180, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8,
    shadowRadius: 8,
    elevation: 3,
  },
  optionWrap: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.primary3,
  },
  optionText: {
    fontSize: 12,
    ...fonts.semiBold,
    color: '#0480D8',
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray7,
  },
  infoText: {
    fontSize: 16,
    color: colors.gray9,
    ...fonts.medium,
  },
  labelText: {
    ...fonts.semiBold,
    fontSize: 16,
    color: colors.gray10,
  },
  dateText: {
    fontSize: 12,
    color: colors.gray6,
  },
  mapWrap: {
    width: '100%',
    height: 120,
    backgroundColor: colors.gray3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
