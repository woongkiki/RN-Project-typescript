import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import {
  TableColumn,
  TableHeader,
  TableRow,
  TableRowData,
} from '../../components/Table';
import { BASE_URL } from '../../api/util';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = NativeStackScreenProps<MainStackParamList, 'Adjustment'>;

// 컬럼 정의
const COLUMNS: TableColumn[] = [
  { key: 'date', label: '일자' },
  { key: 'name', label: '고객명' },
  { key: 'type', label: '종류' },
  { key: 'subType', label: '타입' },
  { key: 'price', label: '단가', width: 120 },
  { key: 'discount', label: '할인' },
];

// 데이터 (추후 API 연동 시 교체)
const TABLE_DATA: TableRowData[] = [
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
  {
    date: '03.16',
    name: '홍길동',
    type: '연금',
    subType: '구매',
    price: '100,000',
    discount: '30%',
  },
];

const DateInput = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) => (
  <View style={styles.dateWrapper}>
    <TouchableOpacity
      style={styles.dateInput}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 46,
          height: 46,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={{ uri: BASE_URL + '/images/calendar_gray.png' }}
          style={{ width: 16, height: 16, resizeMode: 'contain' }}
        />
      </View>
      <View>
        <CommonText labelText={value} labelTextStyle={[styles.dateText]} />
      </View>
    </TouchableOpacity>
  </View>
);

export default function Adjustment({ navigation }: Props) {
  const { width } = useAppDimensions();

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end' | null>(
    null,
  );

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const handleConfirm = (date: Date) => {
    if (pickerTarget === 'start') {
      if (date > endDate) {
        Alert.alert('알림', '시작일은 종료일보다 클 수 없습니다.');
        setPickerTarget(null);
        return;
      }
      setStartDate(date);
    } else {
      if (date < startDate) {
        Alert.alert('알림', '종료일은 시작일보다 작을 수 없습니다.');
        setPickerTarget(null);
        return;
      }
      setEndDate(date);
    }
    setPickerTarget(null);
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="정산"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={[{ padding: 20 }]}>
          <CommonText
            labelText="정산 예정 금액"
            labelTextStyle={[
              fonts.semiBold,
              { color: colors.gray7, fontSize: 15 },
            ]}
          />
          <CommonText
            labelText="315,000원"
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 26, color: colors.gray10, marginTop: 20 },
            ]}
          />
        </View>
        <View
          style={[
            {
              paddingHorizontal: 20,
              paddingVertical: 15,
              backgroundColor: colors.gray1,
            },
          ]}
        >
          <View style={styles.dateRow}>
            <DateInput
              label="시작일"
              value={formatDate(startDate)}
              onPress={() => setPickerTarget('start')}
            />
            <CommonText labelText="~" labelTextStyle={[styles.dateSeparator]} />
            <DateInput
              label="종료일"
              value={formatDate(endDate)}
              onPress={() => setPickerTarget('end')}
            />
          </View>
        </View>
        <View style={[{ padding: 20 }]}>
          <CommonText
            labelText="정산 내역"
            labelTextStyle={[
              fonts.medium,
              { fontSize: 15, color: colors.gray8 },
            ]}
          />
          <View style={{ marginTop: 15 }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: 'column' }}>
                <TableHeader columns={COLUMNS} />
                {TABLE_DATA.map((row, index) => (
                  <TableRow key={index} columns={COLUMNS} data={row} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={pickerTarget !== null}
        mode="date"
        locale="ko_KR"
        maximumDate={new Date()}
        minimumDate={
          pickerTarget === 'end' && startDate ? startDate : undefined
        }
        date={
          pickerTarget === 'start'
            ? startDate ?? new Date()
            : endDate ?? new Date()
        }
        onConfirm={handleConfirm}
        onCancel={() => setPickerTarget(null)}
        display="spinner"
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: colors.gray9,
    marginBottom: 6,
    ...fonts.medium,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 46,
  },
  calendarIcon: {
    fontSize: 15,
  },
  dateText: {
    fontSize: 15,
    color: colors.gray9,
    ...fonts.medium,
  },
  dateSeparator: {
    fontSize: 16,
    color: colors.gray9,
  },
  th: {
    minWidth: 80,
    height: 32,
    backgroundColor: colors.gray1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thText: {
    fontSize: 12,
    ...fonts.medium,
    color: colors.gray8,
  },
  td: {
    minWidth: 80,
    minHeight: 46,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tdText: {
    fontSize: 14,
    color: colors.gray9,
  },
});
