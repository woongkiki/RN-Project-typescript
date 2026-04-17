import React, { useState, useEffect } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import SubHeader from '../../components/SubHeader';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import CommonInput from '../../components/CommonInput';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import Bar from '../../components/Bar';
import CommonConfirmModal from '../../components/CommonConfirmModal';
import { BASE_URL } from '../../api/util';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DaumAddressModal from '../../components/DaumAddressModal';
import CustomerSearchModal from '../../components/CustomerSearchModal';
import {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../api/schedule';
import { CustomerType } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ScheduleForm'>;

export default function ScheduleForm({ route, navigation }: Props) {
  const { params } = route;
  const isEdit = params?.w === 'u' && !!params?.idx;
  const scheduleIdx = isEdit ? parseInt(params.idx, 10) : null;

  const { width } = useAppDimensions();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerIdx, setCustomerIdx] = useState<number | null>(null);
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [importantVal, setImportantVal] = useState('');
  const [schNotiVal, setSchtNotiVal] = useState(false);

  const importantHandler = (values: string) => {
    setImportantVal(prev => (prev === values ? '' : values));
  };

  const [schDate, setSchDate] = useState<Date>(new Date());
  const [schTime, setSchTime] = useState<Date>(new Date());
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);

  const [addressModal, setAddressModal] = useState(false);
  const [validateModal, setValidateModal] = useState(false);
  const [validateMessage, setValidateMessage] = useState('');
  const [customerModal, setCustomerModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 수정 모드: 기존 데이터 로드
  useEffect(() => {
    if (!isEdit || !scheduleIdx) return;
    setLoading(true);
    getSchedule(scheduleIdx)
      .then(s => {
        setTitle(s.title);
        setContent(s.content ?? '');
        setAddress1(s.addr1 ?? '');
        setAddress2(s.addr2 ?? '');
        setCustomerIdx(s.customerIdx ?? null);
        setCustomerType(s.customerType ?? null);
        setCustomerName(s.customerName ?? '');
        setImportantVal(s.isImportant ?? '');
        setSchtNotiVal(s.noti);

        // schedule_date: YYYY-MM-DD
        const [y, mo, d] = s.scheduleDate.split('-').map(Number);
        setSchDate(new Date(y, mo - 1, d));

        // schedule_time: HH:MM
        if (s.scheduleTime) {
          const [h, m] = s.scheduleTime.split(':').map(Number);
          const timeObj = new Date();
          timeObj.setHours(h, m, 0, 0);
          setSchTime(timeObj);
        }
      })
      .catch(e => Alert.alert('오류', e.message))
      .finally(() => setLoading(false));
  }, [isEdit, scheduleIdx]);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  };

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const toApiDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleConfirm = (date: Date) => {
    if (pickerMode === 'date') setSchDate(date);
    else setSchTime(date);
    setPickerMode(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setValidateMessage('일정명을 입력해주세요.');
      setValidateModal(true);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim() || undefined,
        scheduleDate: toApiDate(schDate),
        scheduleTime: formatTime(schTime),
        addr1: address1,
        addr2: address2,
        isImportant: importantVal,
        customerType: customerType ?? undefined,
        customerIdx: customerIdx ?? undefined,
      };

      if (isEdit && scheduleIdx) {
        await updateSchedule(scheduleIdx, payload);
      } else {
        await createSchedule(payload);
      }
      navigation.goBack();
    } catch (e: any) {
      setValidateMessage(e.message ?? '저장에 실패했습니다.');
      setValidateModal(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!scheduleIdx) return;
    setDeleteModal(false);
    setSaving(true);
    try {
      await deleteSchedule(scheduleIdx);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '삭제에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <SubHeader
          headerLabel={isEdit ? '스케줄 수정' : '스케줄 등록'}
          headerLeftOnPress={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator color={colors.primary} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <SubHeader
        headerLabel={isEdit ? '스케줄 수정' : '스케줄 등록'}
        headerLeftOnPress={() => navigation.goBack()}
        headerRightVisible={isEdit}
        headerRightContent={
          <TouchableOpacity onPress={() => setDeleteModal(true)}>
            <CommonText
              labelText="삭제"
              labelTextStyle={[
                fonts.medium,
                { color: colors.mainRed, fontSize: 16 },
              ]}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView>
        <View style={{ padding: 20 }}>
          <View>
            <CommonText
              labelText="일정명"
              labelTextStyle={[styles.labelStyle]}
            />
            <CommonInput
              value={title}
              onChangeText={setTitle}
              inputStyle={[styles.inputStyle]}
              placeholder="일정 제목을 입력하세요"
              placeholderTextColor={colors.gray6}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="일정내용"
              labelTextStyle={[styles.labelStyle]}
            />
            <CommonInput
              value={content}
              onChangeText={setContent}
              inputStyle={[styles.inputStyle, { height: 90, paddingTop: 12 }]}
              placeholder="일정 내용을 입력하세요."
              placeholderTextColor={colors.gray6}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText labelText="일시" labelTextStyle={[styles.labelStyle]} />
            <View
              style={{
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.gray3,
              }}
            >
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <CommonText
                  labelText="날짜"
                  labelTextStyle={{ color: colors.gray8 }}
                />
                <TouchableOpacity onPress={() => setPickerMode('date')}>
                  <CommonText
                    labelText={formatDate(schDate)}
                    labelTextStyle={[fonts.medium, { color: colors.gray10 }]}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                    paddingTop: 15,
                    marginTop: 15,
                    borderTopWidth: 1,
                    borderTopColor: colors.gray1,
                  },
                ]}
              >
                <CommonText
                  labelText="시간"
                  labelTextStyle={{ color: colors.gray8 }}
                />
                <TouchableOpacity onPress={() => setPickerMode('time')}>
                  <CommonText
                    labelText={formatTime(schTime)}
                    labelTextStyle={[fonts.medium, { color: colors.gray10 }]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText labelText="주소" labelTextStyle={[styles.labelStyle]} />
            <View>
              <CommonInput
                value={address1}
                onChangeText={setAddress1}
                inputStyle={[styles.inputStyle, { paddingRight: 90 }]}
                placeholder="주소를 입력해주세요."
                placeholderTextColor={colors.gray6}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => setAddressModal(true)}
                style={{
                  width: 69,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: colors.gray9,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  marginTop: -16,
                }}
              >
                <CommonText
                  labelText="주소 검색"
                  labelTextStyle={[
                    fonts.semiBold,
                    { fontSize: 12, color: colors.white },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <CommonInput
              value={address2}
              onChangeText={setAddress2}
              inputStyle={[styles.inputStyle, { marginTop: 10 }]}
              placeholder="상세 주소를 입력해주세요."
              placeholderTextColor={colors.gray6}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="고객명"
              labelTextStyle={[styles.labelStyle]}
            />
            <View>
              <CommonInput
                value={customerName}
                onChangeText={setCustomerName}
                inputStyle={[styles.inputStyle]}
                placeholder="고객명을 입력하세요."
                placeholderTextColor={colors.gray6}
              />
              <TouchableOpacity
                onPress={() => setCustomerModal(true)}
                style={{
                  width: 69,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: colors.gray9,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  marginTop: -16,
                }}
              >
                <CommonText
                  labelText="고객 검색"
                  labelTextStyle={[
                    fonts.semiBold,
                    { fontSize: 12, color: colors.white },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="중요도"
              labelTextStyle={[styles.labelStyle]}
            />
            <View style={[styles.row, { gap: 10, flexWrap: 'wrap' }]}>
              {[
                { value: '매우중요', label: '매우 중요' },
                { value: '중요', label: '중요' },
                { value: '약간 중요', label: '약간 중요' },
              ].map(item => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => importantHandler(item.value)}
                  style={[
                    styles.importantBtn,
                    { width: (width - 61) / 3 },
                    importantVal === item.value && styles.importantBtnOn,
                  ]}
                >
                  <CommonText
                    labelText={item.label}
                    style={[
                      styles.importantBtnText,
                      importantVal === item.value && styles.importantBtnTextOn,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <Bar />
        <View style={[{ paddingVertical: 25, paddingHorizontal: 20 }]}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={[styles.row, { gap: 8 }]}>
              <Image
                source={{ uri: BASE_URL + '/images/bell_gray.png' }}
                style={{ width: 16, height: 16, resizeMode: 'contain' }}
              />
              <CommonText
                labelText="일정 2시간 전 알림"
                labelTextStyle={[
                  fonts.medium,
                  { color: colors.gray10, fontSize: 17 },
                ]}
              />
            </View>
            <Switch
              trackColor={{ false: colors.gray1, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.gray1}
              value={schNotiVal}
              onValueChange={() => setSchtNotiVal(!schNotiVal)}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: colors.gray1,
        }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: saving ? colors.gray4 : colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CommonText
              labelText="저장"
              labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* 유효성 오류 모달 */}
      <CommonConfirmModal
        visible={validateModal}
        message={validateMessage}
        confirmText="확인"
        onConfirm={() => setValidateModal(false)}
        oneButton={true}
        confirmButtonStyle={{ backgroundColor: colors.primary }}
      />

      {/* 날짜/시간 피커 */}
      <DateTimePickerModal
        isVisible={pickerMode !== null}
        mode={pickerMode ?? 'date'}
        locale="ko_KR"
        date={pickerMode === 'date' ? schDate : schTime}
        onConfirm={handleConfirm}
        onCancel={() => setPickerMode(null)}
        display="spinner"
      />

      {/* 주소 검색 */}
      <DaumAddressModal
        visible={addressModal}
        onClose={() => setAddressModal(false)}
        onSelect={data => {
          setAddress1(data.address);
          setAddress2('');
        }}
      />

      {/* 고객 검색 */}
      <CustomerSearchModal
        visible={customerModal}
        onClose={() => setCustomerModal(false)}
        onSelect={customer => {
          setCustomerName(customer.name);
          setCustomerIdx(customer.idx ?? null);
          setCustomerType(customer.customerType ?? null);
        }}
      />

      {/* 삭제 확인 모달 */}
      <CommonConfirmModal
        visible={deleteModal}
        message={'삭제된 스케줄은 복구할 수 없습니다.\n\n삭제 하시겠습니까?'}
        cancelText="취소"
        confirmText="삭제"
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  boxMargin: {
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.gray9,
    marginBottom: 10,
  },
  inputStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.gray3,
    height: 50,
    fontSize: 16,
  },
  importantBtn: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importantBtnOn: {
    backgroundColor: colors.primary3,
    borderColor: colors.primary2,
  },
  importantBtnText: {
    fontSize: 15,
    color: colors.gray7,
  },
  importantBtnTextOn: {
    ...fonts.semiBold,
    color: colors.primary,
  },
});
