import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CommonInput from '../../components/CommonInput';
import { colors } from '../../constants/colors';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import SearchInput from '../../components/SearchInput';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import CategoryButton from '../../components/CategoryButton';
import ClientBox from '../../components/ClientBox';

type Props = NativeStackScreenProps<MainStackParamList, 'ProgressList'>;

type DBItem = {
  idx: number;
  name: string;
  age: string;
  gender: string;
  address: string;
  date?: string;
  time?: string;
};

const INITIAL_MENUS: DBItem[] = [
  {
    idx: 1,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
    date: '2026.03.16',
    time: '10:00AM',
  },
  {
    idx: 2,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
    date: '2026.03.16',
    time: '10:00AM',
  },
  {
    idx: 3,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 4,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
    date: '2026.03.16',
    time: '10:00AM',
  },
];

const CATEGORIES = ['상담대기', '통화', '미팅', '계약진행', 'AS요청', '부재'];

export default function ProgressList({ route, navigation }: Props) {
  const { width } = useAppDimensions();

  const { params } = route;

  const scrollViewRef = useRef<ScrollView>(null);
  // 각 카테고리 아이템의 x 위치 저장
  const itemPositions = useRef<Record<string, number>>({});

  const [selectCategory, setSelectCategory] = useState(
    params?.cate == '' ? '상담대기' : params?.cate,
  );

  const isInitialScroll = useRef(true);

  // onLayout에서 초기 스크롤 처리
  const handleLayout = (cate: string, x: number) => {
    itemPositions.current[cate] = x;

    // 초기 진입 시 선택된 카테고리가 레이아웃 완료되면 스크롤
    if (isInitialScroll.current && cate === selectCategory) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: Math.max(0, x - 20),
          animated: false,
        });
        isInitialScroll.current = false;
      }, 50); // 레이아웃 완료 후 약간 딜레이
    }
  };

  // selectCategory 변경 시 해당 위치로 스크롤
  useEffect(() => {
    if (isInitialScroll.current) return; // 초기엔 onLayout에서 처리
    const x = itemPositions.current[selectCategory ?? '상담대기'];
    if (x !== undefined) {
      scrollViewRef.current?.scrollTo({
        x: Math.max(0, x - 20),
        animated: true,
      });
    }
  }, [selectCategory]);

  const [dbData, setDBData] = useState<DBItem[]>(INITIAL_MENUS);

  const renderItem = ({ item, index }: { item: DBItem; index: number }) => {
    return (
      <ClientBox
        item={item}
        onPress={() => console.log('123231')}
        navigation={navigation}
      />
    );
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="진행 중인 업무"
        headerLeftOnPress={() => navigation.goBack()}
      />

      {/* 좌우 스크롤 */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingTop: 15,
          gap: 10,
        }}
        style={{ flexGrow: 0 }} // ✅ 추가
      >
        {CATEGORIES.map(cate => (
          <View
            key={cate}
            onLayout={e => handleLayout(cate, e.nativeEvent.layout.x)}
          >
            <CategoryButton
              onPress={() => setSelectCategory(cate)}
              buttonStats={selectCategory === cate}
              label={cate}
              count={
                cate === '상담대기'
                  ? '3'
                  : cate === '통화'
                  ? '30'
                  : cate === '미팅'
                  ? '54'
                  : '0'
              }
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
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dbText: {
    fontSize: 15,
    color: colors.gray7,
  },
  categoryButton: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.gray1,
    gap: 4,
  },
  categoryButtonText: {
    ...fonts.medium,
    color: colors.gray8,
    fontSize: 14,
  },
});
