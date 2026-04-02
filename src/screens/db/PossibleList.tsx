import React, { useState } from 'react';
import Layout from '../../components/Layout';
import {
  FlatList,
  Image,
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
import ClientBox from '../../components/ClientBox';

type Props = NativeStackScreenProps<MainStackParamList, 'PossibleList'>;

type DBItem = {
  idx: number;
  name: string;
  age: string;
  gender: string;
  address: string;
};

const INITIAL_MENUS: DBItem[] = [
  {
    idx: 1,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 2,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
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
  },
  {
    idx: 5,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 6,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 7,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 8,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 9,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
  {
    idx: 10,
    name: '홍길동',
    age: '45세',
    gender: '남',
    address: '서울특별시 구로구 구로동 ㅁㅁ카페',
  },
];

export default function PossibleList({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [schText, setSchText] = useState('');

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
        headerLabel="가망 고객 리스트"
        headerLeftOnPress={() => navigation.goBack()}
      />

      <View style={{ paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 }}>
        <SearchInput
          value={schText}
          onChangeText={setSchText}
          placeholder="고객명, 지역을 검색하세요"
          onSearchPress={() => {
            // 검색 로직
          }}
        />
      </View>
      <FlatList
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
});
