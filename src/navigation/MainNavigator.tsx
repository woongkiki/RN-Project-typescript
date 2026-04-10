import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackParamList, MainTabParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import DBScreen from '../screens/db/DBScreen';
import Tab2Screen from '../screens/community/CommunityScreen';
import MyPageScreen from '../screens/mypage/MyPageScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Image, Platform, StyleSheet, Text } from 'react-native';
import CommonText from '../components/CommonText';
import MenuSettingScreen from '../screens/home/MenuSetting';
import PossibleList from '../screens/db/PossibleList';
import ProgressList from '../screens/db/ProgressList';
import AllList from '../screens/db/AllList';
import CustomerInfo from '../screens/db/CustomerInfo';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import BoardList from '../screens/community/BoardList';
import FreeBoardList from '../screens/community/FreeBoardList';
import BoardInfo from '../screens/community/BoardInfo';
import BoardForm from '../screens/community/BoardForm';
import ScheduleForm from '../screens/schedule/ScheduleForm';
import MyInfoUpdate from '../screens/mypage/MyInfoUpdate';
import EducationScreen from '../screens/education/EducationScreen';
import VideoDetailScreen from '../screens/education/VideoDetailScreen';
import SeminarScreen from '../screens/seminar/SeminarScreen';
import SeminarInfo from '../screens/seminar/SeminarInfo';
import Adjustment from '../screens/adjust/Adjustment';
import StatScreen from '../screens/statistics/StatScreen';
import { BASE_URL } from '../api/util';
import { ROLE_LEVEL } from '../types';
import NotificationScreen from '../screens/notification/NotificationScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const styles = StyleSheet.create({
  tabBarTextStyle: {
    ...fonts.regular,
    fontSize: 12,
    marginTop: 5,
  },
});

function TabNavigator() {
  const user = useAuthStore(state => state.user); // ← 변경
  const office = useAuthStore(state => state.office);

  // console.log('tab navi office', office);

  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gray9,
        tabBarInactiveTintColor: colors.gray7,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 70 + bottom,
          paddingTop: Platform?.OS === 'android' ? 5 : 10,
          paddingBottom: bottom,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <Image
              source={{
                uri: focused
                  ? BASE_URL + '/images/tab1_on.png'
                  : BASE_URL + '/images/tab1_off.png',
              }}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <CommonText
              labelText={'홈'}
              labelTextStyle={[
                styles.tabBarTextStyle,
                {
                  color: focused ? colors.gray9 : colors.gray5,
                },
                focused && fonts.semiBold,
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tab1"
        component={DBScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={{
                uri: focused
                  ? BASE_URL + '/images/tab2_on.png'
                  : BASE_URL + '/images/tab2_off.png',
              }}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <CommonText
              labelText={'DB'}
              labelTextStyle={[
                styles.tabBarTextStyle,
                {
                  color: focused ? colors.gray9 : colors.gray5,
                },
                focused && fonts.semiBold,
              ]}
            />
          ),
        }}
      />
      {(office?.planCode == 'C' || office?.planCode == 'D') && (
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={{
                  uri: focused
                    ? BASE_URL + '/images/tab3_on.png'
                    : BASE_URL + '/images/tab3_off.png',
                }}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <CommonText
                labelText={'스케줄'}
                labelTextStyle={[
                  styles.tabBarTextStyle,
                  {
                    color: focused ? colors.gray9 : colors.gray5,
                  },
                  focused && fonts.semiBold,
                ]}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Tab2"
        component={Tab2Screen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={{
                uri: focused
                  ? BASE_URL + '/images/tab4_on.png'
                  : BASE_URL + '/images/tab4_off.png',
              }}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <CommonText
              labelText={'커뮤니티'}
              labelTextStyle={[
                styles.tabBarTextStyle,
                {
                  color: focused ? colors.gray9 : colors.gray5,
                },
                focused && fonts.semiBold,
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={{
                uri: focused
                  ? BASE_URL + '/images/tab5_on.png'
                  : BASE_URL + '/images/tab5_off.png',
              }}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <CommonText
              labelText={'전체메뉴'}
              labelTextStyle={[
                styles.tabBarTextStyle,
                {
                  color: focused ? colors.gray9 : colors.gray5,
                },
                focused && fonts.semiBold,
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// MainNavigator.tsx
export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="MenuSetting" component={MenuSettingScreen} />
      <Stack.Screen name="PossibleList" component={PossibleList} />
      <Stack.Screen name="ProgressList" component={ProgressList} />
      <Stack.Screen name="AllList" component={AllList} />
      <Stack.Screen name="CustomerInfo" component={CustomerInfo} />
      <Stack.Screen name="BoardList" component={BoardList} />
      <Stack.Screen name="FreeBoardList" component={FreeBoardList} />
      <Stack.Screen name="BoardInfo" component={BoardInfo} />
      <Stack.Screen name="BoardForm" component={BoardForm} />
      <Stack.Screen name="ScheduleForm" component={ScheduleForm} />
      <Stack.Screen name="MyInfoUpdate" component={MyInfoUpdate} />
      <Stack.Screen name="EducationScreen" component={EducationScreen} />
      <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} />
      <Stack.Screen name="SeminarScreen" component={SeminarScreen} />
      <Stack.Screen name="SeminarInfo" component={SeminarInfo} />
      <Stack.Screen name="Adjustment" component={Adjustment} />
      <Stack.Screen name="StatScreen" component={StatScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
