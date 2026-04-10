import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchInput from '../../components/SearchInput';
import CategoryButton from '../../components/CategoryButton';
import BoardCommon from '../../components/BoardCommon';
import CommonText from '../../components/CommonText';
import { getBoardCategories, getBoardPosts } from '../../api/board';
import { BoardCategory, BoardPostItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'BoardList'>;

const toDate = (iso: string | null | undefined) => iso?.slice(0, 10).replace(/-/g, '.') ?? '';

export default function BoardList({ navigation }: Props) {
  const [schText, setSchText] = useState('');
  const [categories, setCategories] = useState<BoardCategory[]>([]);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(null);
  const [posts, setPosts] = useState<BoardPostItem[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<Partial<Record<number | 'all', number>>>({});

  // 카테고리 목록 로드
  useEffect(() => {
    getBoardCategories('general').then(setCategories).catch(e => console.log('[categories error]', e?.message));
  }, []);

  // 게시글 목록 로드 (카테고리 or 검색어 변경 시)
  useEffect(() => {
    getBoardPosts({
      boardType: 'general',
      categoryIdx: selectedCategoryIdx,
      keyword: schText,
    }).then(res => setPosts(res.posts));
  }, [selectedCategoryIdx, schText]);

  const handleCategorySelect = (idx: number | null) => {
    setSelectedCategoryIdx(idx);
    const key = idx ?? 'all';
    const x = itemPositions.current[key];
    if (x !== undefined) {
      scrollViewRef.current?.scrollTo({ x: Math.max(0, x - 20), animated: true });
    }
  };

  const renderItem = ({ item }: { item: BoardPostItem }) => (
    <View style={{ paddingHorizontal: 20 }}>
      <BoardCommon
        item={{ idx: item.idx, title: item.title, category: item.categoryName ?? '', date: toDate(item.createdAt) }}
        navigation={navigation}
      />
    </View>
  );

  return (
    <Layout>
      <SubHeader headerLabel="일반 게시판" headerLeftOnPress={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <SearchInput
          value={schText}
          onChangeText={setSchText}
          placeholder="제목을 검색하세요"
          onSearchPress={() => {}}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10, gap: 10, alignItems: 'center' }}
        style={{ flexGrow: 0 }}
      >
        {/* 전체 버튼 */}
        <View onLayout={e => { itemPositions.current['all'] = e.nativeEvent.layout.x; }}>
          <CategoryButton
            onPress={() => handleCategorySelect(null)}
            buttonStats={selectedCategoryIdx === null}
            label="전체"
          />
        </View>
        {categories.map(cat => (
          <View
            key={cat.idx}
            onLayout={e => { itemPositions.current[cat.idx] = e.nativeEvent.layout.x; }}
          >
            <CategoryButton
              onPress={() => handleCategorySelect(cat.idx)}
              buttonStats={selectedCategoryIdx === cat.idx}
              label={cat.name}
            />
          </View>
        ))}
      </ScrollView>

      <FlatList
        style={{ flex: 1 }}
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.idx.toString()}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
            <CommonText labelText="게시글이 없습니다" labelTextStyle={{ color: '#999', fontSize: 14 }} />
          </View>
        }
      />
    </Layout>
  );
}
