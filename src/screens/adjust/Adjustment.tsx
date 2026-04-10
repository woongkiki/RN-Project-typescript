import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { getAdjustments, formatAmount } from '../../api/adjustment';
import { AdjustmentItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'Adjustment'>;

const COLUMNS: TableColumn[] = [
  { key: 'date', label: '일자' },
  { key: 'name', label: '고객명' },
  { key: 'grade', label: '등급' },
  { key: 'type', label: '종류' },
  { key: 'price', label: '단가', width: 120 },
  { key: 'status', label: '상태' },
];

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

const toTableRow = (item: AdjustmentItem): TableRowData => ({
  date: item.date,
  name: item.customerName,
  grade: item.dbGradeName,
  type: item.type,
  price: item.unitPrice.toLocaleString('ko-KR'),
  status: item.asExcluded ? 'AS제외' : '정산대상',
});

const DateInput = ({
  value,
  onPress,
}: {
  value: string;
  onPress: () => void;
}) => (
  <View style={styles.dateWrapper}>
    <TouchableOpacity style={styles.dateInput} onPress={onPress} activeOpacity={0.7}>
      <View style={{ width: 46, height: 46, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={{ uri: BASE_URL + '/images/calendar_gray.png' }}
          style={{ width: 16, height: 16, resizeMode: 'contain' }}
        />
      </View>
      <CommonText labelText={value} labelTextStyle={[styles.dateText]} />
    </TouchableOpacity>
  </View>
);

export default function Adjustment({ navigation }: Props) {
  const today = new Date();
  // 시작일: 이번 달 1일 고정, 종료일: 오늘 고정
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState<Date>(firstOfMonth);
  const [endDate, setEndDate] = useState<Date>(today);
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end' | null>(null);

  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState<string>('미확정');
  const [items, setItems] = useState<AdjustmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = (start: Date, end: Date) => {
    setLoading(true);
    getAdjustments(start, end)
      .then(res => {
        setTotalAmount(res.totalAmount);
        setStatus(res.status);
        setItems(res.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(startDate, endDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = (date: Date) => {
    if (pickerTarget === 'start') {
      if (date > endDate) {
        Alert.alert('알림', '시작일은 종료일보다 클 수 없습니다.');
        setPickerTarget(null);
        return;
      }
      setStartDate(date);
      load(date, endDate);
    } else {
      if (date < startDate) {
        Alert.alert('알림', '종료일은 시작일보다 작을 수 없습니다.');
        setPickerTarget(null);
        return;
      }
      setEndDate(date);
      load(startDate, date);
    }
    setPickerTarget(null);
  };

  return (
    <Layout>
      <SubHeader headerLabel="정산" headerLeftOnPress={() => navigation.goBack()} />
      <ScrollView>
        {/* 정산 예정 금액 */}
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CommonText
              labelText="정산 예정 금액"
              labelTextStyle={[fonts.semiBold, { color: colors.gray7, fontSize: 15 }]}
            />
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: status === '확정' ? colors.primary3 : colors.gray1,
                borderRadius: 4,
              }}
            >
              <CommonText
                labelText={status}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 12, color: status === '확정' ? colors.primary : colors.gray6 },
                ]}
              />
            </View>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <CommonText
              labelText={formatAmount(totalAmount)}
              labelTextStyle={[fonts.semiBold, { fontSize: 26, color: colors.gray10, marginTop: 20 }]}
            />
          )}
        </View>

        {/* 날짜 필터 */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 15, backgroundColor: colors.gray1 }}>
          <View style={styles.dateRow}>
            <DateInput value={formatDate(startDate)} onPress={() => setPickerTarget('start')} />
            <CommonText labelText="~" labelTextStyle={[styles.dateSeparator]} />
            <DateInput value={formatDate(endDate)} onPress={() => setPickerTarget('end')} />
          </View>
        </View>

        {/* 정산 내역 테이블 */}
        <View style={{ padding: 20 }}>
          <CommonText
            labelText={`정산 내역 (${items.length}건)`}
            labelTextStyle={[fonts.medium, { fontSize: 15, color: colors.gray8 }]}
          />
          <View style={{ marginTop: 15 }}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : items.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <CommonText
                  labelText="해당 기간의 정산 내역이 없습니다."
                  labelTextStyle={[fonts.medium, { fontSize: 14, color: colors.gray6 }]}
                />
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'column' }}>
                  <TableHeader columns={COLUMNS} />
                  {items.map(item => (
                    <TableRow key={item.idx} columns={COLUMNS} data={toTableRow(item)} />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      <DateTimePickerModal
        isVisible={pickerTarget !== null}
        mode="date"
        locale="ko_KR"
        maximumDate={today}
        minimumDate={pickerTarget === 'end' ? startDate : undefined}
        date={pickerTarget === 'start' ? startDate : endDate}
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
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 46,
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
});
