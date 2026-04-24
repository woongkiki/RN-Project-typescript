import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import {
  ActivityIndicator,
  Alert,
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
import {
  getCustomer,
  getConsultLogs,
  getConsultStatuses,
  updateConsultStatus,
  updateCustomerMemo,
  getCustomerStatusHistory,
  openCustomer,
} from '../../api/customer';
import {
  Customer,
  ConsultLog,
  ConsultStatus,
  StatusHistoryItem,
} from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'CustomerInfo'>;

const fmtDate = (iso: string | null | undefined) => {
  if (!iso) {
    return '-';
  }
  return iso.slice(0, 10).replace(/-/g, '/');
};

const fmtDateTime = (iso: string | null | undefined) => {
  if (!iso) {
    return '-';
  }
  return iso.slice(0, 16).replace('T', ' ');
};

// ─── 진행 상태 선택 바텀시트 ───────────────────────────────────────────────────
const StatusModalContent = ({
  onClose,
  statuses,
  progressStatus,
  onSelect,
}: {
  onClose: () => void;
  statuses: ConsultStatus[];
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
          maxHeight: '70%',
        }}
      >
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
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {statuses.map((s, index) => (
            <TouchableOpacity
              key={s.idx}
              onPress={() => {
                onSelect(s.name);
                onClose();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < statuses.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray1,
                backgroundColor:
                  progressStatus === s.name ? colors.primary3 : colors.white,
              }}
            >
              <CommonText
                labelText={s.name}
                labelTextStyle={[
                  fonts.medium,
                  { fontSize: 16 },
                  progressStatus === s.name && {
                    color: colors.primary,
                    ...fonts.semiBold,
                  },
                ]}
              />
              {progressStatus === s.name && (
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

// ─── 설계사 메모 바텀시트 ──────────────────────────────────────────────────────
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
            placeholder="메모를 입력하세요."
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

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function CustomerInfo({ route, navigation }: Props) {
  const { idx, customerType } = route.params;
  const customerIdx = parseInt(idx, 10);

  const { width } = useAppDimensions();
  const office = useAuthStore(state => state.office);
  const isManager = office?.planCode == 'C' || office?.planCode == 'D';

  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [consultLogs, setConsultLogs] = useState<ConsultLog[]>([]);
  const [statuses, setStatuses] = useState<ConsultStatus[]>([]);

  const [progressStatus, setProgressStatus] = useState('');
  const [memoText, setMemoText] = useState('');
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);

  const [savedStatus, setSavedStatus] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [memoModal, setMemoModal] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    console.log('[CustomerInfo] 호출:', { customerType, customerIdx });
    openCustomer(customerType, customerIdx).catch(e => console.log('[CustomerInfo] openCustomer 에러:', e?.message ?? e));
    Promise.all([
      getCustomer(customerType, customerIdx),
      getConsultLogs(customerType, customerIdx).catch((e) => { console.log('[CustomerInfo] getConsultLogs 에러:', e?.message ?? e); return [] as ConsultLog[]; }),
      getConsultStatuses().catch((e) => { console.log('[CustomerInfo] getConsultStatuses 에러:', e?.message ?? e); return [] as ConsultStatus[]; }),
      getCustomerStatusHistory(customerType, customerIdx).catch(
        (e) => { console.log('[CustomerInfo] getCustomerStatusHistory 에러:', e?.message ?? e); return [] as StatusHistoryItem[]; },
      ),
    ])
      .then(([cust, logs, stats, history]) => {
        console.log('[CustomerInfo] getCustomer 응답:', JSON.stringify(cust));
        console.log('[CustomerInfo] tts 개수:', cust?.tts?.length ?? 0);
        console.log('[CustomerInfo] recordingUrl:', cust?.recordingUrl);
        setCustomer(cust);
        setConsultLogs(logs);
        setStatuses(stats);
        setStatusHistory(history);
        if (cust) {
          setProgressStatus(cust.consultStatus);
          setSavedStatus(cust.consultStatus);
          setMemoText(cust.memo ?? '');
        }
      })
      .catch(e => console.log('[CustomerInfo] 전체 에러:', e?.message ?? e))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusSelect = (status: string) => {
    setProgressStatus(status);
  };

  const handleStatusSave = async () => {
    setStatusSaving(true);
    try {
      await updateConsultStatus(customerType, customerIdx, progressStatus);
      setSavedStatus(progressStatus);
      setCustomer(prev =>
        prev ? { ...prev, consultStatus: progressStatus } : null,
      );
      getCustomerStatusHistory(customerType, customerIdx)
        .then(setStatusHistory)
        .catch(() => {});
      Alert.alert('완료', '상태가 변경되었습니다.');
    } catch {
      Alert.alert('오류', '상태 변경에 실패했습니다.');
    } finally {
      setStatusSaving(false);
    }
  };

  const handleMemoSave = async () => {
    try {
      await updateCustomerMemo(customerType, customerIdx, memoText);
      setCustomer(prev => (prev ? { ...prev, memo: memoText } : null));
      setMemoModal(false);
    } catch {
      Alert.alert('오류', '메모 저장에 실패했습니다.');
    }
  };

  // 최신 상담 이력
  const latestLog =
    consultLogs.length > 0 ? consultLogs[consultLogs.length - 1] : null;

  if (loading) {
    return (
      <Layout>
        <SubHeader
          headerLabel="고객 상세 정보"
          headerLeftOnPress={() => navigation.goBack()}
        />
        <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} />
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <SubHeader
          headerLabel="고객 상세 정보"
          headerLeftOnPress={() => navigation.goBack()}
        />
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <CommonText
            labelText="고객 정보를 불러올 수 없습니다."
            labelTextStyle={[
              fonts.medium,
              { fontSize: 15, color: colors.gray6 },
            ]}
          />
        </View>
      </Layout>
    );
  }

  return (
    <Layout
      scrollable={true}
      scrollViewStyle={{ backgroundColor: colors.gray1 }}
      scrollViewContentStyle={{ padding: 20, paddingBottom: 0 }}
      headerChildren={
        <SubHeader
          headerLabel="고객 상세 정보"
          headerLeftOnPress={() => navigation.goBack()}
        />
      }
    >
      {/* ── 기본 정보 ── */}
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
              labelText={customer.name}
              labelTextStyle={[
                fonts.semiBold,
                { color: colors.gray10, fontSize: 22 },
              ]}
            />
            <CommonText
              labelText={customer.phone ?? '-'}
              labelTextStyle={[
                fonts.regular,
                { color: colors.gray7, fontSize: 14 },
              ]}
            />
          </View>
          {customer.phone && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${customer.phone}`)}
              style={styles.callButton}
            >
              <Image
                source={{ uri: BASE_URL + '/images/phon_icon_blue.png' }}
                style={{ width: 16, height: 16, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 생년월일 / 직업 / 주소 */}
        {(customer.birthDate || customer.age || customer.job || customer.address) && (
        <View style={{ paddingTop: 15, gap: 5 }}>
          {(customer.birthDate || customer.age) && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/birthday_icon.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 90 }}>
                <CommonText
                  labelText={
                    customer.birthDate && customer.age
                      ? `${fmtDate(customer.birthDate)}(${customer.age}세)`
                      : customer.birthDate
                        ? fmtDate(customer.birthDate)
                        : `${customer.age}세`
                  }
                  labelTextStyle={[
                    fonts.regular,
                    { fontSize: 13, color: colors.gray9 },
                  ]}
                />
              </View>
            </View>
          )}
          {customer.job && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/job_icon.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 90 }}>
                <CommonText
                  labelText={customer.job}
                  labelTextStyle={[
                    fonts.regular,
                    { fontSize: 13, color: colors.gray9 },
                  ]}
                />
              </View>
            </View>
          )}
          {customer.address && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/address_icon_black.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 90 }}>
                <CommonText
                  labelText={customer.address}
                  labelTextStyle={[
                    fonts.regular,
                    { fontSize: 13, color: colors.gray9 },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
        )}
        {customer.familyConsult && (
          <View style={[{ flexDirection: 'row', gap: 10, marginTop: 15 }]}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: colors.primary3,
              }}
            >
              <CommonText
                labelText="가족상담 신청"
                style={[fonts.semiBold, { fontSize: 12, color: '#0480d8' }]}
              />
            </View>
          </View>
        )}

        {/* 상세 정보 그리드 */}
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            flexWrap: 'wrap',
            borderTopWidth: 1,
            borderTopColor: colors.gray1,
            marginTop: 15,
          }}
        >
          {customer.productCategoryName != '' && (
            <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
              <CommonText
                labelText="DB 종류"
                labelTextStyle={[styles.infoLabel]}
              />
              <CommonText
                labelText={customer.productCategoryName ?? '-'}
                labelTextStyle={[styles.infoText]}
              />
            </View>
          )}

          <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
            <CommonText
              labelText="등록 일시"
              labelTextStyle={[styles.infoLabel]}
            />
            <CommonText
              labelText={fmtDateTime(
                customer.distributeAt ?? customer.createdAt,
              )}
              labelTextStyle={[styles.infoText]}
            />
          </View>
          <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
            <CommonText
              labelText="담당 상담사"
              labelTextStyle={[styles.infoLabel]}
            />
            <CommonText
              labelText={customer.assignedAccountName ?? '미배정'}
              labelTextStyle={[styles.infoText]}
            />
          </View>
          {latestLog?.nextConsultDate && (
            <View style={{ width: (width - 75) / 2, gap: 12, marginTop: 14 }}>
              <CommonText
                labelText="다음 상담일"
                labelTextStyle={[styles.infoLabel]}
              />
              <CommonText
                labelText={fmtDate(latestLog.nextConsultDate)}
                labelTextStyle={[styles.infoText, { color: colors.primary }]}
              />
            </View>
          )}
        </View>

        {/* 진행 상태 */}
        <View style={{ marginTop: 15, gap: 12 }}>
          <CommonText
            labelText="진행 상태"
            labelTextStyle={[styles.infoLabel]}
          />
          <TouchableOpacity
            onPress={() => setStatusModal(true)}
            style={{
              borderRadius: 8,
              padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor:
                progressStatus !== savedStatus ? colors.primary : colors.gray3,
            }}
          >
            <CommonText
              labelText={progressStatus}
              labelTextStyle={[fonts.medium, { fontSize: 16 }]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
              style={{ width: 12, height: 8, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
          {progressStatus !== savedStatus && (
            <TouchableOpacity
              onPress={handleStatusSave}
              disabled={statusSaving}
              style={{
                height: 44,
                borderRadius: 8,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: statusSaving ? 0.6 : 1,
              }}
            >
              <CommonText
                labelText={statusSaving ? '저장 중...' : '수정하기'}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 15, color: '#fff' },
                ]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── 상담 녹취 ── */}
      {customer.recordingUrl && (
        <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
          <CommonText
            labelText="상담 녹취"
            labelTextStyle={[fonts.medium, { fontSize: 14 }]}
          />
          <AudioPlayer
            url={customer.recordingUrl}
            title={customer.recordingName ?? '상담 녹취'}
            ttsItems={customer.tts}
            onPositionChange={() => {}}
          />
        </View>
      )}

      {/* ── 상담 이력 (최신 1건) ── */}
      {latestLog && (
        <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
          <View
            style={{
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
            }}
          >
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
              <CommonText
                labelText="상담 이력"
                labelTextStyle={[styles.labelText]}
              />
            </View>
            <CommonText
              labelText={fmtDate(latestLog.createdAt)}
              labelTextStyle={[styles.dateText]}
            />
          </View>
          <CommonText
            labelText={latestLog.content}
            labelTextStyle={[
              { fontSize: 15, lineHeight: 21, color: colors.gray9 },
            ]}
          />
          {latestLog.memo && (
            <CommonText
              labelText={latestLog.memo}
              labelTextStyle={[
                { fontSize: 13, lineHeight: 19, color: colors.gray6 },
              ]}
            />
          )}
        </View>
      )}

      {/* ── 설계사 메모 ── */}
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
              <CommonText
                labelText="설계사 메모"
                labelTextStyle={[styles.labelText]}
              />
            </View>
            <CommonText
              labelText={fmtDate(customer.updatedAt)}
              labelTextStyle={[styles.dateText]}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setMemoText(customer.memo ?? '');
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
        <CommonText
          labelText={customer.memo ?? '메모가 없습니다.'}
          labelTextStyle={[
            { fontSize: 15, lineHeight: 21 },
            customer.memo ? { color: colors.gray9 } : { color: colors.gray5 },
          ]}
        />
      </View>

      {/* ── 상태 변경 이력 ── */}
      {statusHistory.length > 0 && (
        <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
            }}
          >
            <Image
              source={{ uri: BASE_URL + '/images/history_arr.png' }}
              style={{ width: 10, height: 12, resizeMode: 'contain' }}
            />
            <CommonText
              labelText="상태 변경 이력"
              labelTextStyle={[styles.labelText]}
            />
          </View>
          {statusHistory.map(item => (
            <View
              key={item.idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.gray1,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  flex: 1,
                }}
              >
                <CommonText
                  labelText={item.prevStatus}
                  labelTextStyle={[{ fontSize: 13, color: colors.gray6 }]}
                />
                <Image
                  source={{ uri: BASE_URL + '/images/history_arr.png' }}
                  style={{ width: 5, height: 6, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText={item.nextStatus}
                  labelTextStyle={[
                    fonts.medium,
                    { fontSize: 13, color: colors.gray10 },
                  ]}
                />
              </View>
              <CommonText
                labelText={item.changedAt.slice(2, 10).replace(/-/g, '.')}
                labelTextStyle={[{ fontSize: 12, color: colors.gray6 }]}
              />
            </View>
          ))}
        </View>
      )}

      {/* ── 스케줄 (매니저 이상, 스케줄 있을 때만) ── */}
      {isManager && customer.latestSchedule && (
        <View style={[styles.infoWrap, { marginBottom: 16, gap: 10 }]}>
          <View
            style={{
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/calendar_black.png' }}
                style={{ width: 14, height: 14, resizeMode: 'contain' }}
              />
              <CommonText
                labelText="스케줄"
                labelTextStyle={[styles.labelText]}
              />
            </View>
          </View>
          <View style={{ gap: 10 }}>
              <CommonText
                labelText={customer.latestSchedule!.title}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 16, color: colors.gray10 },
                ]}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CommonText
                  labelText={fmtDate(customer.latestSchedule!.scheduleDate)}
                  labelTextStyle={[
                    fonts.regular,
                    { fontSize: 12, color: colors.primary },
                  ]}
                />
                {customer.latestSchedule!.scheduleTime && (
                  <>
                    <View
                      style={{
                        width: 1,
                        height: 8,
                        backgroundColor: colors.gray3,
                        marginHorizontal: 5,
                      }}
                    />
                    <CommonText
                      labelText={customer.latestSchedule!.scheduleTime}
                      labelTextStyle={[
                        fonts.regular,
                        { fontSize: 12, color: colors.primary },
                      ]}
                    />
                  </>
                )}
              </View>
              {customer.latestSchedule!.addr1 && (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <Image
                    source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                    style={{ width: 10, height: 10, resizeMode: 'contain' }}
                  />
                  <View style={{ width: width - 90 }}>
                    <CommonText
                      labelText={[
                        customer.latestSchedule!.addr1,
                        customer.latestSchedule!.addr2,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      labelTextStyle={[
                        fonts.regular,
                        { fontSize: 13, color: colors.gray7 },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
          <View style={styles.mapWrap}>
            <WebView
              source={{
                uri:
                  BASE_URL + '/map.php?addr=' + customer.latestSchedule?.addr1,
              }}
              style={{ flex: 1, borderRadius: 8 }}
              scrollEnabled={false}
              javaScriptEnabled
              userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            />
          </View>
        </View>
      )}

      {/* ── 진행 상태 모달 ── */}
      <Modal
        visible={statusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModal(false)}
      >
        <SafeAreaProvider>
          <StatusModalContent
            onClose={() => setStatusModal(false)}
            statuses={statuses}
            progressStatus={progressStatus}
            onSelect={handleStatusSelect}
          />
        </SafeAreaProvider>
      </Modal>

      {/* ── 메모 모달 ── */}
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
            onSave={handleMemoSave}
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
  callButton: {
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
