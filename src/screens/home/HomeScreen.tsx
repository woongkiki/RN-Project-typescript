// src/screens/home/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store'; // ← 변경
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import { useBackExit } from '../../hooks/useBackExit';
import MainHeader from '../../components/MainHeader';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import DonutChart from '../../components/DonutChart';
import MenuButton from '../../components/MenuButton';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import Bar from '../../components/Bar';
import BoardCommon from '../../components/BoardCommon';
import { BASE_URL } from '../../api/util';

type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  keyof MainStackParamList
>;

export default function HomeScreen() {
  useBackExit();

  const { width, isFolded, isTablet } = useAppDimensions();

  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user); // ← 변경
  const brandConfig = useAuthStore(state => state.brandConfig); // ← 변경

  const buttonWidth =
    (user?.grade ?? 0) > 2 ? (width - 40) / 4 : (width - 41) / 3;

  const menuSettingMove = () => {
    navigation.navigate('MenuSetting');
  };

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1~12

  const isNextDisabled =
    currentYear === today.getFullYear() &&
    currentMonth === today.getMonth() + 1;

  const goPrev = () => {
    if (currentMonth === 1) {
      setCurrentYear(y => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goNext = () => {
    if (isNextDisabled) return;
    if (currentMonth === 12) {
      setCurrentYear(y => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // 월의 마지막 날 계산
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();

  return (
    <Layout
      edges={['top']}
      scrollable={true}
      headerChildren={
        <MainHeader
          headerLabel={brandConfig?.brandName + ''}
          headerRightContent={
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationScreen')}
              style={{
                width: 48,
                height: 48,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/hd_bell.png' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: colors.mainRed,
                  position: 'absolute',
                  top: 12,
                  right: 0,
                }}
              ></View>
            </TouchableOpacity>
          }
        />
      }
    >
      <LinearGradient
        colors={['rgba(224, 242, 255, 0.3)', '#FFFFFF']}
        locations={[0, 0.75]} // 40% 지점에서 이미 흰색 도달
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // 위 → 아래
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
          }}
        >
          <View>
            <CommonText
              labelText={`${user?.name}님`}
              labelTextStyle={[styles.welcome, fonts.semiBold]} // ✅
            />
            <CommonText
              labelText="안녕하세요!"
              labelTextStyle={[styles.welcome, { marginTop: 5 }]}
            />
          </View>
          <Image
            source={{ uri: BASE_URL + '/images/home_hand.png' }}
            style={{ width: 74, height: 74, resizeMode: 'contain' }}
          />
        </View>
      </LinearGradient>
      <View style={[styles.chartBoxWrap]}>
        <View style={[styles.chartBox]}>
          <View
            style={[
              styles.horizontalBox,
              { alignItems: 'center', justifyContent: 'space-between' },
            ]}
          >
            <TouchableOpacity style={[styles.chartDateButton]} onPress={goPrev}>
              <Image
                source={{ uri: BASE_URL + '/images/left_arr_btn.png' }}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <CommonText
                labelText={`${currentYear}년 ${currentMonth}월`}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 18, color: colors.gray10 },
                ]}
              />
              <CommonText
                labelText={`${currentMonth}월 1일 ~ ${lastDay}일 기준`}
                labelTextStyle={[
                  { fontSize: 11, color: colors.gray6, marginTop: 5 },
                ]}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.chartDateButton,
                { opacity: isNextDisabled ? 0.3 : 1 },
              ]}
              onPress={goNext}
              disabled={isNextDisabled}
            >
              <Image
                source={{ uri: BASE_URL + '/images/right_arr_btn.png' }}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.chartContentBox, styles.shadowBox]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingVertical: 15,
              }}
            >
              <DonutChart
                value={75}
                total={100}
                unit="percent"
                label="사용 DB"
              />
              <DonutChart
                value={3}
                total={10}
                unit="fraction"
                label="미팅완료"
              />
              <DonutChart
                value={3}
                total={10}
                unit="fraction"
                label="계약완료"
              />
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.gray1 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TabNavigator', { screen: 'Tab1' })
                }
                style={{
                  width: '100%',
                  paddingVertical: 13,
                  // backgroundColor: 'yellow',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 5,
                }}
              >
                <CommonText
                  labelText="자세히"
                  labelTextStyle={[
                    fonts.medium,
                    { fontSize: 14, color: colors.gray6 },
                  ]}
                />
                <Image
                  source={{ uri: BASE_URL + '/images/gray_arr.png' }}
                  style={{ width: 6, height: 16, resizeMode: 'contain' }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: 25,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
          <MenuButton
            onPress={() =>
              navigation.navigate('TabNavigator', { screen: 'Tab1' })
            }
            label="DB리스트"
            iconUri={BASE_URL + '/images/dblist_icon.png'}
            iconWidth={30}
            iconHeight={28}
          />
        </View>
        <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
          <MenuButton
            onPress={() =>
              navigation.navigate('EducationScreen', { tab: 'tab1' })
            }
            label={'교육'}
            iconUri={BASE_URL + '/images/edu_icon.png'}
            iconWidth={32}
            iconHeight={28}
          />
        </View>
        <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
          <MenuButton
            onPress={() =>
              navigation.navigate('TabNavigator', { screen: 'Tab2' })
            }
            label="커뮤니티"
            iconUri={BASE_URL + '/images/community_icon.png'}
            iconWidth={30}
            iconHeight={30}
          />
        </View>
        <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
          <MenuButton
            onPress={() => navigation.navigate('Adjustment')}
            label="정산"
            iconUri={BASE_URL + '/images/adjust_icon.png'}
            iconWidth={26}
            iconHeight={30}
          />
        </View>
        <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
          <MenuButton
            onPress={() => navigation.navigate('SeminarScreen')}
            label="세미나"
            iconUri={BASE_URL + '/images/seminar_icon.png'}
            iconWidth={30}
            iconHeight={30}
          />
        </View>
        {(user?.grade ?? 0) > 2 && (
          <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
            <MenuButton
              onPress={() =>
                navigation.navigate('TabNavigator', { screen: 'Schedule' })
              }
              label="스케줄"
              iconUri={BASE_URL + '/images/schedule_icon_b.png'}
              iconWidth={30}
              iconHeight={30}
            />
          </View>
        )}
        {(user?.grade ?? 0) > 2 && (
          <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
            <MenuButton
              onPress={() => navigation.navigate('StatScreen')}
              label="통계/분석"
              iconUri={BASE_URL + '/images/stat_icon.png'}
              iconWidth={30}
              iconHeight={30}
            />
          </View>
        )}

        <View style={[styles.menuButtonWrap, { width: buttonWidth }]}>
          <MenuButton
            onPress={menuSettingMove}
            label="메뉴설정"
            iconUri={BASE_URL + '/images/menu_setting_icon.png'}
            iconWidth={32}
            iconHeight={32}
            iconWrapStyle={{
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.gray1,
            }}
          />
        </View>
      </View>
      <Bar />
      <View style={[styles.boardWrap]}>
        <View
          style={[
            styles.horizontalBox,
            {
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 10,
            },
          ]}
        >
          <CommonText
            labelText="일반 게시판"
            style={[fonts.bold, { fontSize: 20, color: colors.gray10 }]}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('BoardList')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
          >
            <CommonText
              labelText="더보기"
              style={[fonts.medium, { fontSize: 13, color: colors.primary }]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/sky_arr.png' }}
              style={{ width: 3, height: 6 }}
            />
          </TouchableOpacity>
        </View>

        <BoardCommon
          item={{
            idx: 5,
            isNew: true,
            category: '보험상품',
            title: '보험상품 문의드립니다. 보험상품 문의드립니다.',
            date: '2026.03.15',
          }}
          navigation={navigation}
        />
        <BoardCommon
          item={{
            idx: 5,
            isNew: true,
            category: '보험상품',
            title: '보험상품 문의드립니다. 보험상품 문의드립니다.',
            date: '2026.03.15',
          }}
          navigation={navigation}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: { fontSize: 22, color: colors.gray10 },
  chartBoxWrap: {
    paddingHorizontal: 20,
  },
  chartBox: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.gray1,
  },
  horizontalBox: {
    flexDirection: 'row',
    flex: 1,
  },
  chartDateButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContentBox: {
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: colors.white,
    marginTop: 17,
  },
  shadowBox: {
    // iOS
    shadowColor: 'rgba(175, 176, 180, 1)',
    shadowOffset: {
      width: 0, // x0
      height: 3, // y3
    },
    shadowOpacity: 0.15,
    shadowRadius: 9, // blur9 → shadowRadius = blur / 2 ≈ 4.5 (또는 9 그대로 사용)

    // Android
    elevation: 4,

    backgroundColor: '#fff', // shadow 렌더링에 반드시 필요
  },
  menuButtonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardWrap: {
    padding: 20,
  },
  borderTitle: {
    ...fonts.medium,
    fontSize: 16,
  },
});
