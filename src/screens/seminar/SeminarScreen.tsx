import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
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
import { getBoardCategories, getSeminarPosts } from '../../api/board';
import { BoardCategory, SeminarPostItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SeminarScreen'>;

const toDeadline = (iso: string) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}(${
    ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  }) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
    2,
    '0',
  )}까지`;
};

export default function SeminarScreen({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [schText, setSchText] = useState('');
  const [seminarData, setSeminarData] = useState<SeminarPostItem[]>([]);
  const [categories, setCategories] = useState<BoardCategory[]>([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(
    null,
  );

  useEffect(() => {
    getBoardCategories('seminar').then(setCategories);
  }, []);

  useEffect(() => {
    getSeminarPosts({
      categoryIdx: selectedCategoryIdx,
      keyword: schText,
    }).then(setSeminarData);
  }, [selectedCategoryIdx, schText]);

  const selectedCategoryName =
    categories.find(c => c.idx === selectedCategoryIdx)?.name ?? '전체';

  const handleCategorySelect = (name: string) => {
    const cat = categories.find(c => c.name === name);
    setSelectedCategoryIdx(cat?.idx ?? null);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: SeminarPostItem;
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SeminarInfo', { idx: item.idx })}
      style={{
        width: (width - 55) / 2,
        marginRight: index % 2 === 0 ? 15 : 0,
        marginBottom: 25,
      }}
    >
      <Image
        source={{
          uri:
            item.thumbnailUrl != ''
              ? item.thumbnailUrl
              : 'https://picsum.photos/200',
        }}
        style={{
          width: '100%',
          height: 120,
          resizeMode: 'stretch',
          borderRadius: 10,
        }}
      />
      <View style={{ marginTop: 10, gap: 8 }}>
        <CommonText
          labelText={toDeadline(item.deadline)}
          labelTextStyle={[fonts.medium, { fontSize: 12, color: colors.gray6 }]}
        />
        <CommonText
          labelText={item.title}
          labelTextStyle={[fonts.semiBold, { color: colors.gray10 }]}
          numberOfLines={2}
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
              backgroundColor: item.isFull ? colors.gray1 : colors.primary3,
              borderRadius: 4,
            }}
          >
            <CommonText
              labelText={item.isFull ? '정원마감' : '모집중'}
              labelTextStyle={[
                fonts.semiBold,
                {
                  fontSize: 11,
                  color: item.isFull ? colors.gray6 : colors.primary,
                },
              ]}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Image
              source={{ uri: BASE_URL + '/images/my_icon_gray.png' }}
              style={{ width: 10, height: 10, resizeMode: 'contain' }}
            />
            <CommonText
              labelText={`${item.registeredCount}/${item.capacity}`}
              labelTextStyle={[{ fontSize: 12, color: colors.gray6 }]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            labelText={selectedCategoryName}
            labelTextStyle={[
              fonts.medium,
              { color: colors.gray9, fontSize: 14 },
            ]}
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
      <FlatList
        style={{ flex: 1 }}
        data={seminarData}
        renderItem={renderItem}
        keyExtractor={item => item.idx.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
            <CommonText labelText="게시글이 없습니다" labelTextStyle={{ color: '#999', fontSize: 14 }} />
          </View>
        }
      />
      <CategorySelectModal
        visible={categoryModal}
        onClose={() => setCategoryModal(false)}
        selectedCategory={selectedCategoryName}
        onSelect={handleCategorySelect}
        categories={['전체', ...categories.map(c => c.name)]}
      />
    </Layout>
  );
}
