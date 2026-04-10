import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import SubHeader from '../../components/SubHeader';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import SearchInput from '../../components/SearchInput';
import BoardCommon from '../../components/BoardCommon';
import VideoListItem from '../../components/VideoListItem';
import { BASE_URL } from '../../api/util';
import CategorySelectModal from '../../components/CategorySelectModal';
import {
  getDocCategoriesForEducation,
  getEducationDocs,
  getEducationVideos,
  getVideoCategoriesForEducation,
} from '../../api/board';
import { BoardCategory, BoardPostItem, EducationVideoItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'EducationScreen'>;

const toDate = (iso: string | null | undefined) => iso?.slice(0, 10).replace(/-/g, '.') ?? '';

type ListItem = EducationVideoItem | BoardPostItem;

export default function EducationScreen({ route, navigation }: Props) {
  const { params } = route;
  const { width } = useAppDimensions();

  const [tab, setTab] = useState(params?.tab ?? 'tab1');
  const [schText, setSchText] = useState('');
  const [categoryModal, setCategoryModal] = useState(false);

  // 탭별 카테고리
  const [videoCategories, setVideoCategories] = useState<BoardCategory[]>([]);
  const [docCategories, setDocCategories] = useState<BoardCategory[]>([]);

  // 탭별 선택 카테고리 idx
  const [tab1CategoryIdx, setTab1CategoryIdx] = useState<number | null>(null);
  const [tab2CategoryIdx, setTab2CategoryIdx] = useState<number | null>(null);

  // 탭별 데이터
  const [videoData, setVideoData] = useState<EducationVideoItem[]>([]);
  const [docData, setDocData] = useState<BoardPostItem[]>([]);

  // 카테고리 로드
  useEffect(() => {
    getVideoCategoriesForEducation().then(setVideoCategories);
    getDocCategoriesForEducation().then(setDocCategories);
  }, []);

  // 동영상 탭 데이터 로드
  useEffect(() => {
    getEducationVideos({ categoryIdx: tab1CategoryIdx, keyword: tab === 'tab1' ? schText : undefined }).then(setVideoData);
  }, [tab1CategoryIdx, schText, tab]);

  // 교육자료 탭 데이터 로드
  useEffect(() => {
    getEducationDocs({ categoryIdx: tab2CategoryIdx, keyword: tab === 'tab2' ? schText : undefined }).then(setDocData);
  }, [tab2CategoryIdx, schText, tab]);

  // 현재 탭 기준 카테고리 목록 (모달용)
  const currentCategories = (tab === 'tab1' ? videoCategories : docCategories).map(c => c.name);
  const currentCategoryName = (() => {
    if (tab === 'tab1') {
      return videoCategories.find(c => c.idx === tab1CategoryIdx)?.name ?? '전체';
    }
    return docCategories.find(c => c.idx === tab2CategoryIdx)?.name ?? '전체';
  })();

  const handleCategorySelect = (name: string) => {
    if (tab === 'tab1') {
      const cat = videoCategories.find(c => c.name === name);
      setTab1CategoryIdx(cat?.idx ?? null);
    } else {
      const cat = docCategories.find(c => c.name === name);
      setTab2CategoryIdx(cat?.idx ?? null);
    }
  };

  const videoRenderItem = ({ item, index }: { item: EducationVideoItem; index: number }) => (
    <VideoListItem
      item={{
        idx: item.idx,
        title: item.title,
        content: item.description,
        thumb: item.thumbnailUrl,
        date: toDate(item.createdAt),
        isEnd: item.isCompleted,
      }}
      index={index}
      onPress={() => navigation.navigate('VideoDetailScreen', { idx: item.idx })}
    />
  );

  const docRenderItem = ({ item }: { item: BoardPostItem }) => (
    <View style={{ paddingHorizontal: 20 }}>
      <BoardCommon
        item={{ idx: item.idx, title: item.title, category: item.categoryName ?? '', date: toDate(item.createdAt) }}
        navigation={navigation}
      />
    </View>
  );

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    if (tab === 'tab1') return videoRenderItem({ item: item as EducationVideoItem, index });
    return docRenderItem({ item: item as BoardPostItem });
  };

  return (
    <Layout>
      <SubHeader headerLabel="교육" headerLeftOnPress={() => navigation.goBack()} />

      {/* 탭 */}
      <View style={[styles.row, { width, borderBottomWidth: 1, borderBottomColor: colors.gray2 }]}>
        <TouchableOpacity
          onPress={() => setTab('tab1')}
          style={[styles.tabButton, tab === 'tab1' && { borderBottomColor: colors.primary }]}
        >
          <CommonText
            labelText="동영상 교육"
            style={[styles.tabButtonText, tab === 'tab1' && fonts.semiBold, tab === 'tab1' && { color: colors.gray10 }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('tab2')}
          style={[styles.tabButton, tab === 'tab2' && { borderBottomColor: colors.primary }]}
        >
          <CommonText
            labelText="교육 자료"
            style={[styles.tabButtonText, tab === 'tab2' && fonts.semiBold, tab === 'tab2' && { color: colors.gray10 }]}
          />
        </TouchableOpacity>
      </View>

      {/* 검색 + 카테고리 */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => setCategoryModal(true)}
          style={styles.categoryBtn}
        >
          <CommonText
            labelText={currentCategoryName}
            labelTextStyle={[fonts.medium, { color: colors.gray9, fontSize: 14 }]}
            numberOfLines={1}
          />
          <Image
            source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
            style={{ width: 12, height: 7, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
        <View style={{ width: width - 140 }}>
          <SearchInput
            value={schText}
            onChangeText={setSchText}
            placeholder="검색어를 입력해주세요."
            onSearchPress={() => {}}
            inputStyle={{ width: width - 182, borderRadius: 0 }}
          />
        </View>
      </View>

      <FlatList<ListItem>
        style={{ flex: 1 }}
        data={tab === 'tab1' ? videoData : docData}
        renderItem={renderItem}
        keyExtractor={item => item.idx.toString()}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
            <CommonText labelText="게시글이 없습니다" labelTextStyle={{ color: '#999', fontSize: 14 }} />
          </View>
        }
      />

      <CategorySelectModal
        visible={categoryModal}
        onClose={() => setCategoryModal(false)}
        selectedCategory={currentCategoryName}
        onSelect={handleCategorySelect}
        categories={['전체', ...currentCategories]}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  tabButton: {
    width: '50%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.white,
  },
  tabButtonText: { ...fonts.medium, fontSize: 16, color: colors.gray7 },
  categoryBtn: {
    width: 100,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#F5F6F9',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
});
