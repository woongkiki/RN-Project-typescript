import React, { useState } from 'react';
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
import FilterBottomSheet, {
  FilterState,
} from '../../components/Filterbottomsheet';
import { BASE_URL } from '../../api/util';

type Props = NativeStackScreenProps<MainStackParamList, 'AllList'>;

type DBItem = {
  idx: number;
  name: string;
  age: string;
  gender: string;
  address: string;
  date?: string;
  time?: string;
  isView?: boolean;
};

const INITIAL_MENUS: DBItem[] = [
  {
    idx: 1,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
    isView: false,
  },
  {
    idx: 2,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
    isView: true,
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
    isView: true,
  },
];

// 변경 후
const getToday = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const TODAY = getToday();

export default function AllList({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [schText, setSchText] = useState('');

  const [selectCategory, setSelectCategory] = useState('전체');
  const [dbData, setDBData] = useState<DBItem[]>(INITIAL_MENUS);

  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    startDate: TODAY,
    endDate: TODAY,
    selectedStatuses: [],
  });

  const renderItem = ({ item, index }: { item: DBItem; index: number }) => {
    return (
      <ClientBox
        item={item}
        isViewVisible={true}
        onPress={() => console.log('123231')}
        navigation={navigation}
      />
    );
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="전체 고객 리스트"
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
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingTop: 10,
          gap: 10,
          alignItems: 'center',
        }}
        style={{ flexGrow: 0 }} // ✅ 추가
      >
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={[
            styles.row,
            {
              height: 36,
              paddingHorizontal: 15,
              borderRadius: 20,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.gray3,
              gap: 4,
            },
          ]}
        >
          <Image
            source={{ uri: BASE_URL + '/images/filter_icon.png' }}
            style={{ width: 16, height: 16, resizeMode: 'contain' }}
          />
          <CommonText
            labelText="필터"
            style={[fonts.medium, { color: colors.gray8 }]}
          />
        </TouchableOpacity>
        <View style={{ height: 24, width: 1, backgroundColor: colors.gray2 }} />
        <CategoryButton
          onPress={() => setSelectCategory('전체')}
          buttonStats={selectCategory == '전체' ? true : false}
          label="전체"
        />
        <CategoryButton
          onPress={() => setSelectCategory('미열람')}
          buttonStats={selectCategory == '미열람' ? true : false}
          label="미열람"
        />
        <CategoryButton
          onPress={() => setSelectCategory('열람')}
          buttonStats={selectCategory == '열람' ? true : false}
          label="열람"
        />
      </ScrollView>

      {/* 좌우 스크롤 */}
      <FlatList
        style={{ flex: 1 }}
        data={dbData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filter={filter}
        onApply={setFilter}
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
