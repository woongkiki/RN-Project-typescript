import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { fonts } from '../../constants/fonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../api/util';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { DayProps } from 'react-native-calendars/src/calendar/day';
import { getSchedules, Schedule } from '../../api/schedule';

// 앱 초기화 시 한 번만 실행
LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function ScheduleScreen() {
  const { width } = useAppDimensions();

  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const [selected, setSelected] = useState(today);
  const [currentYearMonth, setCurrentYearMonth] = useState(today.slice(0, 7)); // YYYY-MM

  // 월별 전체 스케줄 (캘린더 dot 표시용)
  const [monthSchedules, setMonthSchedules] = useState<Schedule[]>([]);
  // 선택 날짜 스케줄 목록
  const [daySchedules, setDaySchedules] = useState<Schedule[]>([]);
  const [, setLoadingMonth] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const scheduleAdd = () => {
    navigation.navigate('ScheduleForm', { idx: '', w: '' });
  };

  const scheduleUpdate = (idx: number) => {
    navigation.navigate('ScheduleForm', { idx: String(idx), w: 'u' });
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return today.replace(/-/g, '.');
    return dateString.replace(/-/g, '.');
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour < 12 ? 'AM' : 'PM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(hour12).padStart(2, '0')}:${m} ${ampm}`;
  };

  // 월별 스케줄 로드
  const loadMonthSchedules = useCallback(async (yearMonth: string) => {
    setLoadingMonth(true);
    try {
      const list = await getSchedules({ yearMonth });
      setMonthSchedules(list);
    } catch (e: any) {
      console.error('[ScheduleScreen] loadMonthSchedules:', e);
    } finally {
      setLoadingMonth(false);
    }
  }, []);

  // 선택 날짜 스케줄 로드
  const loadDaySchedules = useCallback(async (date: string) => {
    setLoadingDay(true);
    try {
      const list = await getSchedules({ date });
      setDaySchedules(list);
    } catch (e: any) {
      console.error('[ScheduleScreen] loadDaySchedules:', e);
    } finally {
      setLoadingDay(false);
    }
  }, []);

  // 화면 포커스 시 재조회
  useFocusEffect(
    useCallback(() => {
      loadMonthSchedules(currentYearMonth);
      loadDaySchedules(selected);
    }, [currentYearMonth, selected, loadMonthSchedules, loadDaySchedules]),
  );

  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
    loadDaySchedules(day.dateString);
  };

  const handleMonthChange = (month: { year: number; month: number }) => {
    const ym = `${month.year}-${String(month.month).padStart(2, '0')}`;
    setCurrentYearMonth(ym);
    loadMonthSchedules(ym);
  };

  const getMarkedDates = () => {
    const marks: Record<string, any> = {};

    // 월별 스케줄 dot 표시
    for (const s of monthSchedules) {
      marks[s.scheduleDate] = {
        ...marks[s.scheduleDate],
        marked: true,
        dotColor: colors.primary,
      };
    }

    // 선택된 날짜 하이라이트
    marks[selected] = {
      ...marks[selected],
      selected: true,
      selectedColor: 'rgba(173, 216, 230, 0.5)',
      selectedTextColor: '#000',
    };

    return marks;
  };

  return (
    <Layout
      edges={['top']}
      scrollable={true}
      scrollViewStyle={{ backgroundColor: colors.gray1 }}
      headerChildren={
        <MainHeader
          headerLabel={'스케줄'}
          headerRightContent={
            <TouchableOpacity
              onPress={scheduleAdd}
              style={{
                width: 48,
                height: 48,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/plus_icon_black.png' }}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          }
        />
      }
    >
      <View
        style={{
          paddingHorizontal: 5,
          backgroundColor: '#fff',
          paddingBottom: 10,
        }}
      >
        <Calendar
          current={today}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          renderHeader={date => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            return (
              <CommonText
                labelText={`${year}년 ${month}월`}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 16, color: colors.gray10 },
                ]}
              />
            );
          }}
          renderArrow={direction => (
            <Image
              source={
                direction === 'left'
                  ? { uri: BASE_URL + '/images/left_arr_btn.png' }
                  : { uri: BASE_URL + '/images/right_arr_btn.png' }
              }
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          )}
          markedDates={getMarkedDates()}
          theme={{
            textMonthFontWeight: 'bold',
            textMonthFontSize: 16,
            arrowColor: colors.gray9,
            textSectionTitleColor: colors.gray6,
            dayTextColor: colors.gray10,
            todayTextColor: colors.primary,
            textDayFontSize: 14,
            textDisabledColor: colors.gray3,
          }}
          dayComponent={({
            date,
            state,
            marking,
            onPress,
          }: DayProps & { date?: DateData }) => {
            if (!date) return null;

            const isDisabled = state === 'disabled';
            const dayOfWeek = new Date(date.dateString).getDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            const textColor = isDisabled
              ? colors.gray3
              : isSunday
              ? '#FF3B30'
              : isSaturday
              ? colors.primary
              : colors.gray10;

            return (
              <TouchableOpacity
                onPress={() => onPress?.(date)}
                style={{ alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: marking?.selected
                      ? 'rgba(173,216,230,0.5)'
                      : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CommonText
                    labelText={date.day.toString()}
                    labelTextStyle={{ color: textColor, fontSize: 14 }}
                  />
                </View>
                {marking?.marked && (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.primary,
                      marginTop: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={[styles.scheduleWrap]}>
        <CommonText
          labelText={formatDisplayDate(selected)}
          style={[styles.dateLabel]}
        />

        {loadingDay ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : daySchedules.length === 0 ? (
          <View style={styles.emptyWrap}>
            <CommonText
              labelText="등록된 일정이 없습니다."
              labelTextStyle={[{ fontSize: 14, color: colors.gray6 }]}
            />
          </View>
        ) : (
          daySchedules.map(item => (
            <TouchableOpacity
              key={item.idx}
              onPress={() => scheduleUpdate(item.idx)}
              style={[styles.scheduleCard, { marginBottom: 10 }]}
            >
              <CommonText
                labelText={item.title}
                style={[fonts.semiBold, { fontSize: 16, color: colors.gray10 }]}
              />
              <View style={[styles.row, { gap: 5 }]}>
                <CommonText
                  labelText={formatDisplayDate(item.scheduleDate)}
                  style={[styles.datetimeText]}
                />
                <View style={[{ width: 1, height: 8, backgroundColor: colors.gray3 }]} />
                <CommonText
                  labelText={formatTime(item.scheduleTime ?? '')}
                  style={[styles.datetimeText]}
                />
              </View>
              {item.addr1 ? (
                <View style={[styles.row, { gap: 4 }]}>
                  <Image
                    source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                    style={{ width: 10, height: 10, resizeMode: 'contain' }}
                  />
                  <View style={{ width: width - 80 }}>
                    <CommonText
                      labelText={[item.addr1, item.addr2].filter(Boolean).join(' ')}
                      labelTextStyle={[{ fontSize: 12, color: colors.gray7 }]}
                    />
                  </View>
                </View>
              ) : null}
              {item.customerName ? (
                <CommonText
                  labelText={`고객: ${item.customerName}`}
                  labelTextStyle={[{ fontSize: 12, color: colors.gray6 }]}
                />
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleWrap: {
    backgroundColor: colors.gray1,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  dateLabel: {
    ...fonts.semiBold,
    fontSize: 18,
    color: colors.gray10,
    marginBottom: 20,
  },
  datetimeText: {
    fontSize: 12,
    color: colors.primary,
  },
  scheduleCard: {
    gap: 10,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    shadowColor: 'rgba(175, 176, 180, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
});
