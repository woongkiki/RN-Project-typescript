import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import SubHeader from '../../components/SubHeader';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import SearchInput from '../../components/SearchInput';
import { BASE_URL } from '../../api/util';
import CategorySelectModal from '../../components/CategorySelectModal';

type Props = NativeStackScreenProps<MainStackParamList, 'SeminarScreen'>;

type SeminarItem = {
  idx: number;
  title: string;
  thumb: string;
  date: string;
  isEnd: boolean;
  total: string;
  count: string;
};

const seminar_item: SeminarItem[] = [
  {
    idx: 1,
    title: '[26.03] 클로징 세일즈 정공법 세미나 특강',
    thumb: 'https://picsum.photos/74',
    date: '3/15(일) 22:00까지',
    isEnd: true,
    total: '50',
    count: '45',
  },
  {
    idx: 2,
    title: '[26.03] 클로징 세일즈 정공법 세미나 특강',
    thumb: 'https://picsum.photos/74',
    date: '3/15(일) 22:00까지',
    isEnd: false,
    total: '50',
    count: '45',
  },
  {
    idx: 3,
    title: '[26.03] 클로징 세일즈 정공법 세미나 특강',
    thumb: 'https://picsum.photos/74',
    date: '3/15(일) 22:00까지',
    isEnd: true,
    total: '50',
    count: '45',
  },
  {
    idx: 4,
    title: '[26.03] 클로징 세일즈 정공법 세미나 특강',
    thumb: 'https://picsum.photos/74',
    date: '3/15(일) 22:00까지',
    isEnd: false,
    total: '50',
    count: '45',
  },
  {
    idx: 5,
    title: '[26.03] 클로징 세일즈 정공법 세미나 특강',
    thumb: 'https://picsum.photos/74',
    date: '3/15(일) 22:00까지',
    isEnd: true,
    total: '50',
    count: '45',
  },
  {
    idx: 6,
    title: '[26.03] 클로징 세일즈 정공법 세미나 특강',
    thumb: 'https://picsum.photos/74',
    date: '3/15(일) 22:00까지',
    isEnd: false,
    total: '50',
    count: '45',
  },
];

const CATEGORIES = ['전체', '생명보험', '손해보험', '제3보험'];

export default function SeminarScreen({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [schText, setSchText] = useState('');
  const [seminarData, setSeminarData] = useState<SeminarItem[]>(seminar_item);

  const [categoryModal, setCategoryModal] = useState(false);
  const [category, setCategory] = useState('전체');

  const renderItem = ({
    item,
    index,
  }: {
    item: SeminarItem;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('SeminarInfo', { idx: item.idx })}
        style={{
          width: (width - 55) / 2,
          marginRight: index % 2 == 0 ? 15 : 0,
          marginBottom: 25,
        }}
      >
        <Image
          source={{ uri: 'https://picsum.photos/74' }}
          style={{
            width: '100%',
            height: 120,
            resizeMode: 'stretch',
            borderRadius: 10,
          }}
        />
        <View style={{ marginTop: 10, gap: 8 }}>
          <CommonText
            labelText={item.date}
            labelTextStyle={[
              fonts.medium,
              { fontSize: 12, color: colors.gray6 },
            ]}
          />
          <CommonText
            labelText={item.title}
            labelTextStyle={[fonts.semiBold, { color: colors.gray10 }]}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 5,
                backgroundColor: item.isEnd ? colors.gray1 : colors.primary3,
                borderRadius: 4,
              }}
            >
              <CommonText
                labelText={item.isEnd ? '정원마감' : '모집중'}
                labelTextStyle={[
                  fonts.semiBold,
                  {
                    fontSize: 11,
                    color: item.isEnd ? colors.gray6 : colors.primary,
                  },
                ]}
              />
            </View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/my_icon_gray.png' }}
                style={{
                  width: 10,
                  height: 10,
                  resizeMode: 'contain',
                }}
              />
              <CommonText
                labelText={item.count + '/' + item.total}
                labelTextStyle={[{ fontSize: 12, color: colors.gray6 }]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="세미나"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          onPress={() => setCategoryModal(true)}
          style={{
            width: 100,
            height: 42,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            backgroundColor: '#F5F6F9',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <CommonText
            labelText={category}
            labelTextStyle={[
              fonts.medium,
              { color: colors.gray9, fontSize: 14 },
            ]}
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
            onSearchPress={() => {
              // 검색 로직
            }}
            inputStyle={{ width: width - 182, borderRadius: 0 }}
          />
        </View>
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={seminarData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
      <CategorySelectModal
        visible={categoryModal}
        onClose={() => setCategoryModal(false)}
        selectedCategory={category}
        onSelect={setCategory}
        categories={CATEGORIES}
      />
    </Layout>
  );
}
