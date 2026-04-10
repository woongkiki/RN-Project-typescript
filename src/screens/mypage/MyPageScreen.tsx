// src/screens/mypage/MyPageScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuthStore } from '../../store'; // ← 변경
import Layout from '../../components/Layout';
import { colors } from '../../constants/colors';
import MainHeader from '../../components/MainHeader';
import CommonText from '../../components/CommonText';
import MenuButton from '../../components/MenuButton';
import { fonts } from '../../constants/fonts';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import AllMenuLabel from '../../components/AllMenuLabel';
import CommonConfirmModal from '../../components/CommonConfirmModal';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../api/util';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function MyPageScreen() {
  const navigation = useNavigation<NavigationProp>();

  const user = useAuthStore(state => state.user);
  const office = useAuthStore(state => state.office);
  const clearAuth = useAuthStore(state => state.clearAuth);

  const { width } = useAppDimensions();

  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <Layout
      edges={['top']}
      scrollable={true}
      scrollViewStyle={{ backgroundColor: colors.white }}
      headerChildren={
        <MainHeader
          headerLabel={'전체메뉴'}
          headerRightContent={
            <TouchableOpacity
              onPress={() => setLogoutModal(true)}
              style={{
                width: 48,
                height: 48,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/logout_icon.png' }}
                style={{ width: 16, height: 16, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          }
        />
      }
    >
      <View style={[styles.myinfoWrap]}>
        <TouchableOpacity onPress={() => navigation.navigate('MyInfoUpdate')}>
          <CommonText
            labelText={office?.name ?? ''}
            style={[fonts.semiBold, { color: colors.primary }]}
          />
          <View style={[styles.row, { gap: 10, marginTop: 10 }]}>
            <CommonText
              labelText={`${user?.name}님`}
              style={[fonts.semiBold, { fontSize: 22, lineHeight: 30 }]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/black_arr.png' }}
              style={{ width: 7, height: 14, resizeMode: 'contain' }}
            />
          </View>
        </TouchableOpacity>
        <View
          style={[
            styles.row,
            { justifyContent: 'space-between', marginTop: 25 },
          ]}
        >
          <MenuButton
            onPress={() =>
              navigation.navigate('TabNavigator', { screen: 'Tab1' })
            }
            label="DB리스트"
            iconUri={BASE_URL + '/images/dblist_icon.png'}
            iconWidth={30}
            iconHeight={28}
            iconWrapStyle={[styles.menuButtonBox]}
          />
          <MenuButton
            onPress={() =>
              navigation.navigate('EducationScreen', { tab: 'tab1' })
            }
            label="교육"
            iconUri={BASE_URL + '/images/edu_icon.png'}
            iconWidth={32}
            iconHeight={28}
            iconWrapStyle={[styles.menuButtonBox]}
          />
          <MenuButton
            onPress={() => navigation.navigate('SeminarScreen')}
            label="세미나"
            iconUri={BASE_URL + '/images/seminar_icon.png'}
            iconWidth={30}
            iconHeight={30}
            iconWrapStyle={[styles.menuButtonBox]}
          />
          <MenuButton
            onPress={() => navigation.navigate('Adjustment')}
            label="정산"
            iconUri={BASE_URL + '/images/adjust_icon.png'}
            iconWidth={26}
            iconHeight={30}
            iconWrapStyle={[styles.menuButtonBox]}
          />
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 25,
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            paddingBottom: 25,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray2,
          }}
        >
          <AllMenuLabel
            imageSource={{ uri: BASE_URL + '/images/db_icon_sm.png' }}
            labelText="DB"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TabNavigator', { screen: 'Tab1' })
            }
          >
            <CommonText labelText="DB 리스트" style={[styles.defMenu]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PossibleList')}>
            <CommonText labelText="가망 고객 리스트" style={[styles.defMenu]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProgressList', { cate: '' })}
          >
            <CommonText labelText="진행 중인 업무" style={[styles.defMenu]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AllList')}>
            <CommonText labelText="전체 고객 리스트" style={[styles.defMenu]} />
          </TouchableOpacity>
        </View>
        {(office?.planCode == 'C' || office?.planCode == 'D') && (
          <View
            style={{
              paddingVertical: 25,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray2,
            }}
          >
            <AllMenuLabel
              imageSource={{ uri: BASE_URL + '/images/calendar_mypage.png' }}
              iconWidth={14}
              iconHeight={13}
              labelText="일정"
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TabNavigator', { screen: 'Schedule' })
              }
            >
              <CommonText labelText="스케줄 캘린더" style={[styles.defMenu]} />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            paddingVertical: 25,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray2,
          }}
        >
          <AllMenuLabel
            imageSource={{ uri: BASE_URL + '/images/edu_icon_sm.png' }}
            iconWidth={15}
            iconHeight={12}
            labelText="교육"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EducationScreen', { tab: 'tab1' })
            }
          >
            <CommonText labelText="동영상 교육" style={[styles.defMenu]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EducationScreen', { tab: 'tab2' })
            }
          >
            <CommonText labelText="교육 자료" style={[styles.defMenu]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SeminarScreen')}
          >
            <CommonText labelText="세미나 신청" style={[styles.defMenu]} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 25,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray2,
          }}
        >
          <AllMenuLabel
            imageSource={{ uri: BASE_URL + '/images/community_icon_sm.png' }}
            iconWidth={14}
            iconHeight={13}
            labelText="커뮤니티"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TabNavigator', { screen: 'Tab2' })
            }
          >
            <CommonText labelText="커뮤니티" style={[styles.defMenu]} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 25,
          }}
        >
          <AllMenuLabel
            imageSource={{ uri: BASE_URL + '/images/my_icon_sm.png' }}
            iconWidth={14}
            iconHeight={14}
            labelText="내 활동"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Adjustment')}>
            <CommonText labelText="정산" style={[styles.defMenu]} />
          </TouchableOpacity>
          {(office?.planCode == 'C' || office?.planCode == 'D') && (
            <TouchableOpacity onPress={() => navigation.navigate('StatScreen')}>
              <CommonText labelText="통계/분석" style={[styles.defMenu]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <CommonConfirmModal
        visible={logoutModal}
        message={
          '로그아웃 시 DB 확인 및\n기타 알림을 받지 못할 수 있습니다.\n\n로그아웃하시겠습니까?'
        }
        cancelText="취소" // 기본값 '취소' - 생략 가능
        confirmText="로그아웃" // 기본값 '확인' - 생략 가능
        onCancel={() => setLogoutModal(false)}
        onConfirm={() => {
          // 삭제 로직
          setLogoutModal(false);
          clearAuth(); // isAuthenticated가 false로 → RootNavigator가 AuthNavigator로 전환
        }}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  myinfoWrap: {
    padding: 20,
    backgroundColor: colors.gray1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButtonBox: {
    width: 64,
    height: 64,
    backgroundColor: colors.white,
    // iOS 그림자
    shadowColor: 'rgba(175, 176, 180, 0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 6,
    shadowRadius: 6,

    // Android 그림자
    elevation: 3,
  },
  defMenu: {
    ...fonts.medium,
    fontSize: 15,
    color: colors.gray9,
    marginTop: 20,
  },
});
