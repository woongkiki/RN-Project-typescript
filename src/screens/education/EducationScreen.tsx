import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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

type Props = NativeStackScreenProps<MainStackParamList, 'EducationScreen'>;

type VideoItem = {
  idx: number;
  title: string;
  content: string;
  thumb: string;
  date: string;
  isEnd: boolean;
};

const video_data: VideoItem[] = [
  {
    idx: 1,
    title: '[생명보험] 연금세일즈',
    content:
      '해당 영상에 대한 소개글이 보여집니다. 해당 영상에 대한 소개글이 보여집니다. ',
    thumb: 'https://picsum.photos/74',
    date: '2026.03.13',
    isEnd: true,
  },
  {
    idx: 2,
    title: '[생명보험] 연금세일즈',
    content:
      '해당 영상에 대한 소개글이 보여집니다. 해당 영상에 대한 소개글이 보여집니다. ',
    thumb: 'https://picsum.photos/74',
    date: '2026.03.13',
    isEnd: false,
  },
];

type EduItem = {
  idx: number;
  title: string;
  category: string;
  date: string;
  isNew?: boolean;
};

const edu_data: EduItem[] = [
  {
    idx: 1,
    title: '약관 교육 교재',
    category: '기타',
    date: '2026.03.13',
    isNew: true,
  },
  {
    idx: 2,
    title: '약관 교육 교재',
    category: '기타',
    date: '2026.03.13',
  },
];

// ✅ 탭별 카테고리
const TAB1_CATEGORIES = ['전체', '생명보험', '손해보험', '제3보험'];
const TAB2_CATEGORIES = ['전체', '기타', '약관', '상품'];

type ListItem = VideoItem | EduItem;

export default function EducationScreen({ route, navigation }: Props) {
  const { params } = route;
  const { width } = useAppDimensions();

  const [tab, setTab] = useState(params?.tab ?? 'tab1');
  const [schText, setSchText] = useState('');

  // ✅ 탭별 카테고리 상태 분리
  const [tab1Category, setTab1Category] = useState('전체');
  const [tab2Category, setTab2Category] = useState('전체');
  const [categoryModal, setCategoryModal] = useState(false);

  const [data1, setData1] = useState<VideoItem[]>(video_data);
  const [data2, setData2] = useState<EduItem[]>(edu_data);

  // ✅ 현재 탭의 카테고리/세터
  const currentCategory = tab === 'tab1' ? tab1Category : tab2Category;
  const currentCategories = tab === 'tab1' ? TAB1_CATEGORIES : TAB2_CATEGORIES;
  const handleCategorySelect = (category: string) => {
    if (tab === 'tab1') setTab1Category(category);
    else setTab2Category(category);
  };

  const videoRenderItem = ({
    item,
    index,
  }: {
    item: VideoItem;
    index: number;
  }) => (
    <VideoListItem
      item={item}
      index={index}
      onPress={() =>
        navigation.navigate('VideoDetailScreen', { idx: item.idx })
      }
    />
  );

  const eduDataRenderItem = ({
    item,
    index,
  }: {
    item: EduItem;
    index: number;
  }) => (
    <View style={{ paddingHorizontal: 20 }}>
      <BoardCommon item={item} navigation={navigation} />
    </View>
  );

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    if (tab === 'tab1')
      return videoRenderItem({ item: item as VideoItem, index });
    return eduDataRenderItem({ item: item as EduItem, index });
  };

  const tabSelectHandler = (selectedTab: string) => {
    setTab(selectedTab);
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="교육"
        headerLeftOnPress={() => navigation.goBack()}
      />

      {/* 탭 */}
      <View
        style={[
          styles.row,
          {
            width: width,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray2,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => tabSelectHandler('tab1')}
          style={[
            styles.tabButton,
            tab === 'tab1' && { borderBottomColor: colors.primary },
          ]}
        >
          <CommonText
            labelText="동영상 교육"
            style={[
              styles.tabButtonText,
              tab === 'tab1' && fonts.semiBold,
              tab === 'tab1' && { color: colors.gray10 },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => tabSelectHandler('tab2')}
          style={[
            styles.tabButton,
            tab === 'tab2' && { borderBottomColor: colors.primary },
          ]}
        >
          <CommonText
            labelText="교육 자료"
            style={[
              styles.tabButtonText,
              tab === 'tab2' && fonts.semiBold,
              tab === 'tab2' && { color: colors.gray10 },
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* 검색 + 카테고리 */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          flexDirection: 'row',
        }}
      >
        {/* ✅ 카테고리 선택 버튼 */}
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
            labelText={currentCategory}
            labelTextStyle={[
              fonts.medium,
              {
                color: colors.gray9,
                fontSize: 14,
              },
            ]}
            numberOfLines={1}
          />
          <Image
            source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
            style={{ width: 12, height: 7, resizeMode: 'contain' }}
          />
        </TouchableOpacity>

        {/* 검색창 */}
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

      {/* 리스트 */}
      <FlatList<ListItem>
        style={{ flex: 1 }}
        data={tab === 'tab1' ? data1 : data2}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />

      {/* ✅ 카테고리 모달 - 탭에 따라 카테고리 목록 변경 */}
      <CategorySelectModal
        visible={categoryModal}
        onClose={() => setCategoryModal(false)}
        selectedCategory={currentCategory}
        onSelect={handleCategorySelect}
        categories={currentCategories}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  tabButton: {
    width: '50%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.white,
  },
  tabButtonText: {
    ...fonts.medium,
    fontSize: 16,
    color: colors.gray7,
  },
});
