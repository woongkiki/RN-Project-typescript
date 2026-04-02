import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../constants/colors';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import SearchInput from '../../components/SearchInput';
import { fonts } from '../../constants/fonts';
import CategoryButton from '../../components/CategoryButton';
import BoardCommon from '../../components/BoardCommon';
import CommonText from '../../components/CommonText';

type Props = NativeStackScreenProps<MainStackParamList, 'FreeBoardList'>;

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
  {
    idx: 3,
    title: '보험약관 문의드립니다.',
    category: '보험약관',
    date: '2026.03.13',
  },
  {
    idx: 4,
    title: '보험약관 문의드립니다.',
    category: '보험약관',
    date: '2026.03.13',
  },
  {
    idx: 5,
    title: '보험약관 문의드립니다.',
    category: '보험약관',
    date: '2026.03.13',
  },
  {
    idx: 6,
    title: '보험약관 문의드립니다.',
    category: '보험약관',
    date: '2026.03.13',
  },
];

const CATEGORIES = ['전체', '보험상품', '보험약관', '보험심사', '보상처리'];

export default function FreeBoardList({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [schText, setSchText] = useState('');

  const [selectCategory, setSelectCategory] = useState('전체');
  const [dbData, setDBData] = useState<DBItem[]>(INITIAL_MENUS);

  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    const x = itemPositions.current[selectCategory];
    if (x !== undefined) {
      scrollViewRef.current?.scrollTo({
        x: Math.max(0, x - 20),
        animated: true,
      });
    }
  }, [selectCategory]);

  const boradWriteMove = () => {
    navigation.navigate('BoardForm');
  };

  const renderItem = ({ item, index }: { item: DBItem; index: number }) => {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <BoardCommon item={item} navigation={navigation} />
      </View>
    );
  };

  return (
    <Layout edges={['top', 'bottom']} behavior={undefined}>
      <SubHeader
        headerLabel="자유 게시판"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <SearchInput
          value={schText}
          onChangeText={setSchText}
          placeholder="고객명, 지역을 검색하세요"
          onSearchPress={() => {
            // 검색 로직
          }}
        />
      </View>
      {/* 좌우 스크롤 */}
      <ScrollView
        ref={scrollViewRef} // 추가
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingTop: 10,
          gap: 10,
          alignItems: 'center',
        }}
        style={{ flexGrow: 0 }} // 추가1
      >
        {CATEGORIES.map(cate => (
          <View
            key={cate}
            onLayout={e => {
              itemPositions.current[cate] = e.nativeEvent.layout.x;
            }}
          >
            <CategoryButton
              onPress={() => setSelectCategory(cate)}
              buttonStats={selectCategory === cate}
              label={cate}
            />
          </View>
        ))}
      </ScrollView>

      {/* 좌우 스크롤 */}
      <FlatList
        style={{ flex: 1 }}
        data={dbData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: colors.gray1,
          // backgroundColor: 'red',
        }}
      >
        <TouchableOpacity
          onPress={boradWriteMove}
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonText
            labelText="작성하기"
            labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
