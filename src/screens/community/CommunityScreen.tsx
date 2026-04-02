// src/screens/tab1/Tab1Screen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store'; // ← 변경
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import CommonText from '../../components/CommonText';
import CategoryButton from '../../components/CategoryButton';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import BoardCommon from '../../components/BoardCommon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { BASE_URL } from '../../api/util';

type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  keyof MainStackParamList
>;

type DBItem = {
  idx: number;
  title: string;
  category: string;
  date: string;
  isNew?: boolean;
};

const INITIAL_MENUS: DBItem[] = [
  {
    idx: 1,
    title: '보험상품 문의드립니다.',
    category: '보험상품',
    date: '2026.03.13',
  },
  {
    idx: 2,
    title: '보험약관 문의드립니다.',
    category: '보험약관',
    date: '2026.03.13',
  },
];

export default function Tab1Screen() {
  const brandConfig = useAuthStore(state => state.brandConfig); // ← 변경

  const navigation = useNavigation<NavigationProp>();

  const boardMove = () => {
    navigation.navigate('BoardList');
  };

  const freeBoardMove = () => {
    navigation.navigate('FreeBoardList');
  };

  return (
    <Layout
      edges={['top']}
      scrollable={true}
      headerChildren={
        <MainHeader
          headerLabel={'커뮤니티'}
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
      <View style={[{ paddingHorizontal: 20 }]}>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingHorizontal: 20,
            minHeight: 158,
            backgroundColor: colors.primary3,
            borderRadius: 12,
            gap: 25,
            marginTop: 20,
          }}
        >
          <CommonText
            labelText={'새로운 알림을\n확인하세요'}
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 18, color: colors.gray10, lineHeight: 26 },
            ]}
          />
          <CategoryButton
            onPress={() => {}}
            buttonStats={true}
            label="신규알림"
            count="3"
          />
          <Image
            source={{ uri: BASE_URL + '/images/bubble_sky.png' }}
            style={{
              width: 93,
              height: 88,
              resizeMode: 'contain',
              position: 'absolute',
              right: 15,
              bottom: 15,
            }}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={[
              styles.horizontalBox,
              {
                alignItems: 'center',
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
              onPress={boardMove}
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
          <View>
            {INITIAL_MENUS.map((item, index) => {
              return (
                <BoardCommon item={item} key={index} navigation={navigation} />
              );
            })}
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <View
            style={[
              styles.horizontalBox,
              {
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              },
            ]}
          >
            <CommonText
              labelText="자유 게시판"
              style={[fonts.bold, { fontSize: 20, color: colors.gray10 }]}
            />
            <TouchableOpacity
              onPress={freeBoardMove}
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
          <View>
            {INITIAL_MENUS.map((item, index) => {
              return (
                <BoardCommon item={item} key={index} navigation={navigation} />
              );
            })}
          </View>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
  horizontalBox: {
    flexDirection: 'row',
    flex: 1,
  },
});
