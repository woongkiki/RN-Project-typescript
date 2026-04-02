import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import {
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

type Props = NativeStackScreenProps<MainStackParamList, 'ScheduleForm'>;

export default function ScheduleForm({ route, navigation }: Props) {
  const { params } = route;

  const { width } = useAppDimensions();

  const [schName, setSchName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [importantVal, setImportantVal] = useState('');
  const [schNotiVal, setSchtNotiVal] = useState(false);

  const [schDate, setSchDate] = useState<Date>(new Date());
  const [schTime, setSchTime] = useState<Date>(new Date());
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);

  const [addressModal, setAddressModal] = useState(false);

  const [validateModal, setValidateModal] = useState(false);

  const [customerModal, setCustomerModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const importantHandler = (values: any) => {
    if (importantVal == values) {
      setImportantVal('');
    } else {
      setImportantVal(values);
    }
  };

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

  const handleConfirm = (date: Date) => {
    if (pickerMode === 'date') {
      setSchDate(date);
    } else {
      setSchTime(date);
    }
    setPickerMode(null);
  };

  return (
    <Layout>
      <SubHeader
        headerLabel={'스케줄 등록'}
        headerLeftOnPress={() => navigation.goBack()}
        headerRightVisible={params?.w == 'u' ? true : false}
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
              value={schName}
              onChangeText={setSchName}
              inputStyle={[styles.inputStyle]}
              placeholder="일정 제목을 입력하세요"
              placeholderTextColor={colors.gray6}
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
              <TouchableOpacity
                onPress={() => importantHandler('1')}
                style={[
                  styles.importantBtn,
                  { width: (width - 61) / 3 },
                  importantVal == '1' && styles.importantBtnOn,
                ]}
              >
                <CommonText
                  labelText="매우 중요"
                  style={[
                    styles.importantBtnText,
                    importantVal == '1' && styles.importantBtnTextOn,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => importantHandler('2')}
                style={[
                  styles.importantBtn,
                  { width: (width - 61) / 3 },
                  importantVal == '2' && styles.importantBtnOn,
                ]}
              >
                <CommonText
                  labelText="중요"
                  style={[
                    styles.importantBtnText,
                    importantVal == '2' && styles.importantBtnTextOn,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => importantHandler('3')}
                style={[
                  styles.importantBtn,
                  { width: (width - 61) / 3 },
                  importantVal == '3' && styles.importantBtnOn,
                ]}
              >
                <CommonText
                  labelText="약간 중요"
                  style={[
                    styles.importantBtnText,
                    importantVal == '3' && styles.importantBtnTextOn,
                  ]}
                />
              </TouchableOpacity>
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
              <View>
                <CommonText
                  labelText="일정 2시간 전 알림"
                  labelTextStyle={[
                    fonts.medium,
                    { color: colors.gray10, fontSize: 17 },
                  ]}
                />
              </View>
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
          onPress={() => setValidateModal(true)}
          style={{
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
      </View>
      <CommonConfirmModal
        // visible={true}
        visible={validateModal}
        message={
          '설정하신 2026/03/13 13:00에\n중복된 일정이 있습니다.\n다시 시도해 주세요.'
        }
        confirmText="확인" // 기본값 '확인' - 생략 가능
        onConfirm={() => {
          // 삭제 로직
          setValidateModal(false);
        }}
        oneButton={true}
        confirmButtonStyle={{ backgroundColor: colors.primary }}
      />
      <DateTimePickerModal
        isVisible={pickerMode !== null}
        mode={pickerMode ?? 'date'}
        locale="ko_KR"
        date={pickerMode === 'date' ? schDate : schTime}
        onConfirm={handleConfirm}
        onCancel={() => setPickerMode(null)}
        display="spinner"
      />
      <DaumAddressModal
        visible={addressModal}
        onClose={() => setAddressModal(false)}
        onSelect={data => {
          setAddress1(data.address); // 도로명 주소 자동 입력
          setAddress2(''); // 상세주소 초기화
        }}
      />
      <CustomerSearchModal
        visible={customerModal}
        onClose={() => setCustomerModal(false)}
        onSelect={customer => setCustomerName(customer.name)}
      />
      <CommonConfirmModal
        visible={deleteModal}
        message={'삭제된 스케줄은 복구할 수 없습니다.\n\n삭제 하시겠습니까?'}
        cancelText="취소" // 기본값 '취소' - 생략 가능
        confirmText="삭제" // 기본값 '확인'
        onCancel={() => setDeleteModal(false)}
        onConfirm={() => {
          // 삭제 로직
          setDeleteModal(false);
        }}
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
