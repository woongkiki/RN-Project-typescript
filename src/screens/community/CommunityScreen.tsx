import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import CommonText from '../../components/CommonText';
import CategoryButton from '../../components/CategoryButton';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import BoardCommon from '../../components/BoardCommon';
import { BASE_URL } from '../../api/util';
import { getBoardPosts } from '../../api/board';
import { BoardPostItem } from '../../types';

type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  keyof MainStackParamList
>;

const toDate = (iso: string | null | undefined) => iso?.slice(0, 10).replace(/-/g, '.') ?? '';

export default function CommunityScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [generalPosts, setGeneralPosts] = useState<BoardPostItem[]>([]);
  const [freePosts, setFreePosts] = useState<BoardPostItem[]>([]);

  useEffect(() => {
    getBoardPosts({ boardType: 'general', limit: 3 }).then(res =>
      setGeneralPosts(res.posts.slice(0, 3)),
    );
    getBoardPosts({ boardType: 'free', limit: 3 }).then(res =>
      setFreePosts(res.posts.slice(0, 3)),
    );
  }, []);

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
              style={{ width: 48, height: 48, alignItems: 'flex-end', justifyContent: 'center' }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/hd_bell.png' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          }
        />
      }
    >
      <View style={{ paddingHorizontal: 20 }}>
        {/* 알림 배너 */}
        <View style={styles.bannerWrap}>
          <CommonText
            labelText={'새로운 알림을\n확인하세요'}
            labelTextStyle={[fonts.semiBold, { fontSize: 18, color: colors.gray10, lineHeight: 26 }]}
          />
          <CategoryButton onPress={() => {}} buttonStats={true} label="신규알림" count="3" />
          <Image
            source={{ uri: BASE_URL + '/images/bubble_sky.png' }}
            style={styles.bannerImage}
          />
        </View>

        {/* 일반 게시판 */}
        <View style={{ marginTop: 30 }}>
          <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }]}>
            <CommonText
              labelText="일반 게시판"
              style={[fonts.bold, { fontSize: 20, color: colors.gray10 }]}
            />
            {generalPosts.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('BoardList')}
                style={styles.row}
              >
                <CommonText labelText="더보기" style={[fonts.medium, { fontSize: 13, color: colors.primary }]} />
                <Image source={{ uri: BASE_URL + '/images/sky_arr.png' }} style={{ width: 3, height: 6, marginLeft: 7 }} />
              </TouchableOpacity>
            )}
          </View>
          {generalPosts.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <CommonText labelText="게시글이 없습니다" labelTextStyle={{ fontSize: 14, color: colors.gray6 }} />
            </View>
          ) : (
            generalPosts.map(post => (
              <BoardCommon
                key={post.idx}
                item={{ idx: post.idx, title: post.title, category: post.categoryName ?? '', date: toDate(post.createdAt) }}
                navigation={navigation}
              />
            ))
          )}
        </View>

        {/* 자유 게시판 */}
        <View style={{ marginTop: 30 }}>
          <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }]}>
            <CommonText
              labelText="자유 게시판"
              style={[fonts.bold, { fontSize: 20, color: colors.gray10 }]}
            />
            {freePosts.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('FreeBoardList')}
                style={styles.row}
              >
                <CommonText labelText="더보기" style={[fonts.medium, { fontSize: 13, color: colors.primary }]} />
                <Image source={{ uri: BASE_URL + '/images/sky_arr.png' }} style={{ width: 3, height: 6, marginLeft: 7 }} />
              </TouchableOpacity>
            )}
          </View>
          {freePosts.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <CommonText labelText="게시글이 없습니다" labelTextStyle={{ fontSize: 14, color: colors.gray6 }} />
            </View>
          ) : (
            freePosts.map(post => (
              <BoardCommon
                key={post.idx}
                item={{ idx: post.idx, title: post.title, category: post.categoryName ?? '', date: toDate(post.createdAt) }}
                navigation={navigation}
              />
            ))
          )}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  bannerWrap: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 158,
    backgroundColor: colors.primary3,
    borderRadius: 12,
    gap: 25,
    marginTop: 20,
  },
  bannerImage: {
    width: 93,
    height: 88,
    resizeMode: 'contain',
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  bellDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.mainRed,
    position: 'absolute',
    top: 12,
    right: 0,
  },
});
