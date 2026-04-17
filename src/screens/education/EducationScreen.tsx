import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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

const PAGE_LIMIT = 15;

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

  // 탭별 페이지 상태
  const [videoPage, setVideoPage] = useState(1);
  const [videoTotal, setVideoTotal] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);

  const [docPage, setDocPage] = useState(1);
  const [docTotal, setDocTotal] = useState(0);
  const [docLoading, setDocLoading] = useState(false);

  const videoFetchingRef = useRef(false);
  const docFetchingRef = useRef(false);

  // 카테고리 로드
  useEffect(() => {
    getVideoCategoriesForEducation().then(setVideoCategories);
    getDocCategoriesForEducation().then(setDocCategories);
  }, []);

  // 동영상 탭 fetch
  const fetchVideos = useCallback(async (targetPage: number, reset: boolean) => {
    if (videoFetchingRef.current) return;
    videoFetchingRef.current = true;
    setVideoLoading(true);
    try {
      const res = await getEducationVideos({
        categoryIdx: tab1CategoryIdx,
        keyword: tab === 'tab1' ? schText : undefined,
        page: targetPage,
        limit: PAGE_LIMIT,
      });
      setVideoTotal(res.total);
      setVideoData(prev => (reset ? res.videos : [...prev, ...res.videos]));
      setVideoPage(targetPage);
    } catch (e: any) {
      console.log('[videos error]', e?.message);
    } finally {
      videoFetchingRef.current = false;
      setVideoLoading(false);
    }
  }, [tab1CategoryIdx, schText, tab]);

  // 교육자료 탭 fetch
  const fetchDocs = useCallback(async (targetPage: number, reset: boolean) => {
    if (docFetchingRef.current) return;
    docFetchingRef.current = true;
    setDocLoading(true);
    try {
      const res = await getEducationDocs({
        categoryIdx: tab2CategoryIdx,
        keyword: tab === 'tab2' ? schText : undefined,
        page: targetPage,
        limit: PAGE_LIMIT,
      });
      setDocTotal(res.total);
      setDocData(prev => (reset ? res.docs : [...prev, ...res.docs]));
      setDocPage(targetPage);
    } catch (e: any) {
      console.log('[docs error]', e?.message);
    } finally {
      docFetchingRef.current = false;
      setDocLoading(false);
    }
  }, [tab2CategoryIdx, schText, tab]);

  // 동영상 탭 의존성 변경 시 재로드
  useEffect(() => {
    fetchVideos(1, true);
  }, [fetchVideos]);

  // 교육자료 탭 의존성 변경 시 재로드
  useEffect(() => {
    fetchDocs(1, true);
  }, [fetchDocs]);

  const handleLoadMore = () => {
    if (tab === 'tab1') {
      const hasMore = videoData.length < videoTotal;
      if (!videoLoading && hasMore) {
        fetchVideos(videoPage + 1, false);
      }
    } else {
      const hasMore = docData.length < docTotal;
      if (!docLoading && hasMore) {
        fetchDocs(docPage + 1, false);
      }
    }
  };

  const isLoading = tab === 'tab1' ? videoLoading : docLoading;

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

  const ytThumb = (item: EducationVideoItem) =>
    item.thumbnailUrl ||
    (item.youtubeId
      ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
      : '');

  const videoRenderItem = ({ item, index }: { item: EducationVideoItem; index: number }) => (
    <VideoListItem
      item={{
        idx: item.idx,
        title: item.title,
        content: item.description,
        thumb: ytThumb(item),
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

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
              <CommonText labelText="게시글이 없습니다" labelTextStyle={{ color: '#999', fontSize: 14 }} />
            </View>
          ) : null
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
