import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import SearchInput from '../../components/SearchInput';
import CategoryButton from '../../components/CategoryButton';
import BoardCommon from '../../components/BoardCommon';
import CommonText from '../../components/CommonText';
import { getBoardCategories, getBoardPosts } from '../../api/board';
import { BoardCategory, BoardPostItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'FreeBoardList'>;

const toDate = (iso: string | null | undefined) => iso?.slice(0, 10).replace(/-/g, '.') ?? '';

export default function FreeBoardList({ navigation }: Props) {
  const [schText, setSchText] = useState('');
  const [categories, setCategories] = useState<BoardCategory[]>([]);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(null);
  const [posts, setPosts] = useState<BoardPostItem[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<Partial<Record<number | 'all', number>>>({});

  useEffect(() => {
    getBoardCategories('free').then(setCategories);
  }, []);

  const fetchPosts = useCallback(() => {
    getBoardPosts({
      boardType: 'free',
      categoryIdx: selectedCategoryIdx,
      keyword: schText,
    }).then(res => setPosts(res.posts));
  }, [selectedCategoryIdx, schText]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

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
    <Layout edges={['top', 'bottom']} behavior={undefined}>
      <SubHeader headerLabel="자유 게시판" headerLeftOnPress={() => navigation.goBack()} />
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

      <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.gray1 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BoardForm')}
          style={{ height: 52, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <CommonText labelText="작성하기" labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]} />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
