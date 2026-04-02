import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { fonts } from '../../constants/fonts';
import ProgressBox from '../../components/ProgressBox';
import BusinessCountButton from '../../components/BusinessCountButton';
import DbButton from '../../components/DbButton';
import Bar from '../../components/Bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../api/util';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { DayProps } from 'react-native-calendars/src/calendar/day';

// 앱 초기화 시 한 번만 실행 (App.tsx 또는 해당 컴포넌트 상단)
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function ScheduleScreen() {
  const { width } = useAppDimensions();

  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const [selected, setSelected] = useState('');

  const navigation = useNavigation<NavigationProp>();

  const scheduleAdd = () => {
    navigation.navigate('ScheduleForm', { idx: '', w: '' });
  };

  const scheduleUpdate = (idx: any) => {
    navigation.navigate('ScheduleForm', { idx: idx, w: 'u' });
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return today.replace(/-/g, '.');
    return dateString.replace(/-/g, '.');
  };

  const getMarkedDates = () => {
    const marks: Record<string, any> = {
      '2026-04-11': { marked: true, dotColor: colors.primary },
      '2026-04-16': { marked: true, dotColor: colors.primary },
    };

    if (selected) {
      marks[selected] = {
        ...marks[selected], // 기존 marked 속성 유지
        selected: true,
        selectedColor: 'rgba(173, 216, 230, 0.5)',
        selectedTextColor: '#000',
      };
    }

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
          onDayPress={day => setSelected(day.dateString)}
          renderHeader={date => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            return (
              <CommonText
                labelText={`${year}년 ${month}월`}
                labelTextStyle={[
                  fonts.semiBold,
                  {
                    fontSize: 16,
                    color: colors.gray10,
                  },
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
            // 헤더
            textMonthFontWeight: 'bold',
            textMonthFontSize: 16,
            arrowColor: colors.gray9,

            // 요일 헤더
            textSectionTitleColor: colors.gray6,

            // 날짜
            dayTextColor: colors.gray10,
            todayTextColor: colors.primary, // 오늘 날짜 파란색
            textDayFontSize: 14,

            // 비활성(이전/다음달) 날짜
            textDisabledColor: colors.gray3,

            // 일요일 빨간색은 별도 처리 필요 (아래 참고)
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
        <View>
          <CommonText
            labelText={formatDisplayDate(selected || today)}
            style={[styles.dateLabel]}
          />
          <TouchableOpacity
            onPress={() => scheduleUpdate('2')}
            style={{
              gap: 10,
              backgroundColor: colors.white,
              padding: 15,
              borderRadius: 12,
              // iOS 그림자
              shadowColor: 'rgba(175, 176, 180, 0.15)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 8,
              shadowRadius: 8,

              // Android 그림자
              elevation: 3,
            }}
          >
            <CommonText
              labelText="홍길동님과 통화"
              style={[fonts.semiBold, { fontSize: 16, color: colors.gray10 }]}
            />
            <View style={[styles.row, { gap: 5 }]}>
              <CommonText
                labelText={formatDisplayDate(selected || today)}
                style={[styles.datetimeText]}
              />
              <View
                style={[{ width: 1, height: 8, backgroundColor: colors.gray3 }]}
              />
              <CommonText labelText="10:00 AM" style={[styles.datetimeText]} />
            </View>
            <View style={[styles.row, { gap: 4 }]}>
              <Image
                source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 80 }}>
                <CommonText
                  labelText="서울특별시 구로구 구로동 ㅁㅁ카페"
                  labelTextStyle={[{ fontSize: 12, color: colors.gray7 }]}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => scheduleUpdate('1')}
            style={{
              gap: 10,
              backgroundColor: colors.white,
              padding: 15,
              borderRadius: 12,
              marginTop: 10,
              // iOS 그림자
              shadowColor: 'rgba(175, 176, 180, 0.3)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 8,
              shadowRadius: 8,

              // Android 그림자
              elevation: 3,
            }}
          >
            <CommonText
              labelText="홍길동님과 통화"
              style={[fonts.semiBold, { fontSize: 16, color: colors.gray10 }]}
            />
            <View style={[styles.row, { gap: 5 }]}>
              <CommonText
                labelText={formatDisplayDate(selected || today)}
                style={[styles.datetimeText]}
              />
              <View
                style={[{ width: 1, height: 8, backgroundColor: colors.gray3 }]}
              />
              <CommonText labelText="10:00 AM" style={[styles.datetimeText]} />
            </View>
            <View style={[styles.row, { gap: 4 }]}>
              <Image
                source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <View style={{ width: width - 80 }}>
                <CommonText
                  labelText="서울특별시 구로구 구로동 ㅁㅁ카페"
                  labelTextStyle={[{ fontSize: 12, color: colors.gray7 }]}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
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
});
