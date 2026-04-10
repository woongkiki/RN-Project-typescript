import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors';
import { useAppDimensions } from '../hooks/useAppDimensions';
import { BASE_URL } from '../api/util';
import CommonText from './CommonText';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;

export type ProgressStatus =
  | '상담대기'
  | '상담중'
  | '미팅완료'
  | '계약완료'
  | '부재'
  | '통화';

export interface FilterState {
  startDate: string;
  endDate: string;
  selectedStatuses: ProgressStatus[];
}

export const PROGRESS_STATUSES: ProgressStatus[] = [
  '상담대기',
  '상담중',
  '미팅완료',
  '계약완료',
  '부재',
  '통화',
];

export const STATUS_COLORS: Record<ProgressStatus, string> = {
  상담대기: '#FFA500',
  상담중: '#007BFF',
  미팅완료: '#17A2B8',
  계약완료: '#28A745',
  부재: '#6C757D',
  통화: '#6F42C1',
};

const getToday = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const TODAY = getToday();

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filter: FilterState;
  onApply: (filter: FilterState) => void;
}

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
    <CommonText labelText={label} labelTextStyle={styles.dateLabel} />
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
        <CommonText
          labelText={value || '날짜 선택'}
          labelTextStyle={[styles.dateText, !value && { color: '#9CA3AF' }]}
        />
      </View>
    </TouchableOpacity>
  </View>
);

// ✅ Modal 내부 콘텐츠를 별도 컴포넌트로 분리 (SafeAreaProvider 안에서 insets 사용)
const BottomSheetContent = ({
  visible,
  onClose,
  filter,
  onApply,
}: FilterBottomSheetProps) => {
  const insets = useSafeAreaInsets(); // ✅ SafeAreaProvider 안에서 호출되므로 정확한 값 반환
  // console.log('insets:', JSON.stringify(insets)); // ← 추가
  const { width } = useAppDimensions();
  const sheetHeight = BOTTOM_SHEET_HEIGHT;
  // const sheetHeight = BOTTOM_SHEET_HEIGHT - insets.bottom;

  const [localFilter, setLocalFilter] = useState<FilterState>(filter);
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end' | null>(
    null,
  );

  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('.').map(Number);
    return new Date(y, m - 1, d);
  };

  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const handleConfirm = (date: Date) => {
    if (pickerTarget === 'start') {
      const formatted = formatDate(date);
      // 종료일이 있고 시작일이 종료일보다 늦으면 종료일도 같이 맞춤
      if (localFilter.endDate && date > parseDate(localFilter.endDate)) {
        setLocalFilter(prev => ({ ...prev, startDate: formatted, endDate: formatted }));
      } else {
        setLocalFilter(prev => ({ ...prev, startDate: formatted }));
      }
    } else {
      setLocalFilter(prev => ({ ...prev, endDate: formatDate(date) }));
    }
    setPickerTarget(null);
  };

  React.useEffect(() => {
    if (visible) {
      setLocalFilter(filter);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
          speed: 14,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetHeight,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 8,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 120 || vy > 0.8) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    }),
  ).current;

  const toggleStatus = (status: ProgressStatus) => {
    setLocalFilter(prev => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter(s => s !== status)
        : [...prev.selectedStatuses, status],
    }));
  };

  const reset = () => {
    setLocalFilter({ startDate: '', endDate: '', selectedStatuses: [] });
  };

  const handleApply = () => {
    onApply(localFilter);
    onClose();
  };

  return (
    <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            height: sheetHeight,
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.sheetHeaderWrap}>
          <View style={styles.sheetHeader}>
            <CommonText labelText="필터" labelTextStyle={styles.sheetTitle} />
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={reset}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: BASE_URL + '/images/refresh_gray.png' }}
                style={{ width: 12, height: 12, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetScroll}
        >
          <View style={styles.dateRow}>
            <DateInput
              label="시작일"
              value={localFilter.startDate}
              onPress={() => setPickerTarget('start')}
            />
            <CommonText labelText={'~'} labelTextStyle={styles.dateSeparator} />
            <DateInput
              label="종료일"
              value={localFilter.endDate}
              onPress={() => setPickerTarget('end')}
            />
          </View>

          <DateTimePickerModal
            isVisible={pickerTarget !== null}
            mode="date"
            locale="ko_KR"
            maximumDate={new Date()}
            minimumDate={
              pickerTarget === 'end' && localFilter.startDate
                ? parseDate(localFilter.startDate)
                : undefined
            }
            date={
              pickerTarget === 'start'
                ? parseDate(localFilter.startDate)
                : parseDate(localFilter.endDate)
            }
            onConfirm={handleConfirm}
            onCancel={() => setPickerTarget(null)}
            display="spinner"
          />

          <CommonText
            labelText={'진행상태'}
            labelTextStyle={styles.sectionLabel}
          />
          <View style={styles.statusGrid}>
            {PROGRESS_STATUSES.map(status => {
              const selected = localFilter.selectedStatuses.includes(status);
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusChip,
                    { width: (width - 56) / 3 },
                    selected && styles.statusChipSelected,
                  ]}
                  onPress={() => toggleStatus(status)}
                  activeOpacity={0.7}
                >
                  <CommonText
                    labelText={status}
                    labelTextStyle={[
                      styles.statusChipText,
                      selected && styles.statusChipTextSelected,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.applyWrapper}>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.85}
          >
            <CommonText
              labelText={'적용하기'}
              labelTextStyle={styles.applyBtnText}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// ✅ 외부 컴포넌트에서 Modal + SafeAreaProvider 감싸기
const FilterBottomSheet = ({
  visible,
  onClose,
  filter,
  onApply,
}: FilterBottomSheetProps) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* ✅ Modal 안에 SafeAreaProvider 별도 추가 */}
      <SafeAreaProvider>
        <BottomSheetContent
          visible={visible}
          onClose={onClose}
          filter={filter}
          onApply={onApply}
        />
      </SafeAreaProvider>
    </Modal>
  );
};

export default FilterBottomSheet;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  dragArea: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  sheetHeaderWrap: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  sheetTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: colors.gray10,
  },
  resetBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEF1F5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: 'rgba(174, 187, 196, 0.2)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 3,
    shadowRadius: 3,
    elevation: 3,
  },
  sheetScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 24,
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
  dateText: {
    fontSize: 15,
    color: colors.gray9,
    ...fonts.medium,
  },
  dateSeparator: {
    fontSize: 16,
    color: '#9CA3AF',
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
  },
  sectionLabel: {
    fontSize: 14,
    ...fonts.medium,
    color: colors.gray9,
    marginBottom: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipSelected: {
    borderColor: colors.primary2,
    backgroundColor: colors.primary3,
  },
  statusChipText: {
    fontSize: 15,
    color: colors.gray7,
  },
  statusChipTextSelected: {
    ...fonts.semiBold,
    color: colors.primary,
  },
  applyWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    ...fonts.medium,
  },
});
