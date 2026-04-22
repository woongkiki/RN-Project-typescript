// src/screens/home/HomeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store'; // ← 변경
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
import { BoardPostItem, DbStats } from '../../types';
import { getBoardPosts } from '../../api/board';
import { getDbStats } from '../../api/customer';
import { getNotifications } from '../../api/notification';
import { getPlanMenus, MenuCode } from '../../api/plan';
import { getMenuOrder } from '../../api/menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  keyof MainStackParamList
>;

export default function HomeScreen() {
  useBackExit();

  const { width, isFolded, isTablet } = useAppDimensions();

  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user);
  const office = useAuthStore(state => state.office);

  const [orderedMenus, setOrderedMenus] = useState<MenuCode[]>([]);

  // 메뉴 순서 로드: AsyncStorage 캐시로 즉시 렌더링 후 API로 갱신
  const loadMenuOrder = useCallback(async () => {
    if (!office) return;
    const planIdx =
      office.planIdx ??
      (office.planCode === 'C' ? 3 : office.planCode === 'B' ? 2 : 1);
    const allowedCodes = await getPlanMenus(planIdx);

    // 캐시로 우선 렌더링
    const cached = await AsyncStorage.getItem('menu-order');
    const cachedOrder: MenuCode[] = cached ? JSON.parse(cached) : [];
    if (cachedOrder.length > 0) {
      const merged = [
        ...cachedOrder.filter(c => allowedCodes.includes(c)),
        ...allowedCodes.filter(c => !cachedOrder.includes(c)),
      ];
      setOrderedMenus(merged);
    }

    // API로 최신 순서 갱신
    const apiOrder = await getMenuOrder();
    if (apiOrder.length > 0) {
      const merged = [
        ...apiOrder.filter(c => allowedCodes.includes(c)),
        ...allowedCodes.filter(c => !apiOrder.includes(c)),
      ];
      setOrderedMenus(merged);
    } else if (cachedOrder.length === 0) {
      setOrderedMenus(allowedCodes);
    }
  }, [office]);

  useEffect(() => {
    loadMenuOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [office?.planIdx, office?.planCode]);

  const hasSchedule = orderedMenus.includes('schedule');
  const buttonWidth = hasSchedule ? (width - 40) / 4 : (width - 41) / 3;

  type MenuNavDef = { label: string; icon: string; onPress: () => void };
  const MENU_NAV: Record<MenuCode, MenuNavDef> = {
    db:        { label: 'DB리스트',  icon: 'dblist_icon.png',      onPress: () => navigation.navigate('TabNavigator', { screen: 'Tab1' }) },
    schedule:  { label: '스케줄',    icon: 'schedule_icon_b.png',  onPress: () => navigation.navigate('TabNavigator', { screen: 'Schedule' }) },
    education: { label: '교육',      icon: 'edu_icon.png',         onPress: () => navigation.navigate('EducationScreen', { tab: 'tab1' }) },
    community: { label: '커뮤니티', icon: 'community_icon.png',   onPress: () => navigation.navigate('TabNavigator', { screen: 'Tab2' }) },
    payment:   { label: '정산',      icon: 'adjust_icon.png',      onPress: () => navigation.navigate('Adjustment') },
    stats:     { label: '통계/분석', icon: 'stat_icon.png',        onPress: () => navigation.navigate('StatScreen') },
    seminar:   { label: '세미나',   icon: 'seminar_icon.png',     onPress: () => navigation.navigate('SeminarScreen') },
  };

  const menuSettingMove = () => {
    navigation.navigate('MenuSetting');
  };

  const [recentPosts, setRecentPosts] = useState<BoardPostItem[]>([]);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getBoardPosts({ boardType: 'general', limit: 2 })
        .then(res => setRecentPosts(res.posts.slice(0, 2)))
        .catch(() => {});
      getNotifications()
        .then(list => setHasUnread(list.some(n => !n.isRead)))
        .catch(() => {});
      loadMenuOrder();
    }, [loadMenuOrder]),
  );

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1~12

  useEffect(() => {
    getDbStats(currentYear, currentMonth, user?.idx ?? undefined)
      .then(setDbStats)
      .catch(() => {});
  }, [currentYear, currentMonth, user?.idx]);

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
          headerLabel={office?.name ?? ''}
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
              {hasUnread && (
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
                />
              )}
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
                value={dbStats?.usedCount ?? 0}
                total={dbStats?.totalCount || 0}
                unit="percent"
                label="사용 DB"
              />
              <DonutChart
                value={dbStats?.meetingCount ?? 0}
                total={dbStats?.totalCount || 0}
                unit="fraction"
                label="미팅완료"
              />
              <DonutChart
                value={dbStats?.contractCount ?? 0}
                total={dbStats?.totalCount || 0}
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
        {orderedMenus.map(code => {
          const def = MENU_NAV[code];
          return (
            <View key={code} style={[styles.menuButtonWrap, { width: buttonWidth }]}>
              <MenuButton
                onPress={def.onPress}
                label={def.label}
                iconUri={BASE_URL + '/images/' + def.icon}
                iconWidth={30}
                iconHeight={30}
              />
            </View>
          );
        })}
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
          {recentPosts.length > 0 && (
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
          )}
        </View>

        {recentPosts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <CommonText
              labelText="게시글이 없습니다"
              labelTextStyle={{ fontSize: 14, color: colors.gray6 }}
            />
          </View>
        ) : (
          recentPosts.map(post => (
            <BoardCommon
              key={post.idx}
              item={{
                idx: post.idx,
                title: post.title,
                category: post.categoryName ?? '',
                date: post.createdAt?.slice(0, 10).replace(/-/g, '.') ?? '',
              }}
              navigation={navigation}
            />
          ))
        )}
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
