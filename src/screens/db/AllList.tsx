import React, { useEffect, useState } from 'react';
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
import { colors } from '../../constants/colors';
import SearchInput from '../../components/SearchInput';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import CategoryButton from '../../components/CategoryButton';
import ClientBox from '../../components/ClientBox';
import FilterBottomSheet, {
  FilterState,
  ProgressStatus,
} from '../../components/Filterbottomsheet';
import { BASE_URL } from '../../api/util';
import { getCustomers } from '../../api/customer';
import { Customer } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'AllList'>;

// "YYYY.MM.DD" → Date (당일 시작/끝 처리)
const toStartOfDay = (s: string): Date => {
  const [y, m, d] = s.split('.').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};
const toEndOfDay = (s: string): Date => {
  const [y, m, d] = s.split('.').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
};

export default function AllList({ navigation }: Props) {
  const [schText, setSchText] = useState('');
  const [selectCategory, setSelectCategory] = useState('전체');
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);

  // 시트에서 편집 중인 상태 (open 시 최신 activeFilter로 초기화됨)
  const [filter, setFilter] = useState<FilterState>({
    startDate: '',
    endDate: '',
    selectedStatuses: [],
  });

  // 실제 적용된 필터 (null = 필터 없음)
  const [activeFilter, setActiveFilter] = useState<FilterState | null>(null);

  const isFilterActive =
    activeFilter !== null &&
    (activeFilter.selectedStatuses.length > 0 ||
      !!activeFilter.startDate ||
      !!activeFilter.endDate);

  useEffect(() => {
    getCustomers().then(data => {
      setAllCustomers(data);
    });
  }, []);

  useEffect(() => {
    let result = [...allCustomers];

    // 열람/미열람 탭
    if (selectCategory === '미열람') {
      result = result.filter(c => c.consultStatus === '상담대기');
    } else if (selectCategory === '열람') {
      result = result.filter(c => c.consultStatus !== '상담대기');
    }

    // 필터 적용 (적용하기 버튼을 눌렀을 때만)
    if (activeFilter) {
      // 날짜 범위: 시작일·종료일 모두 입력된 경우에만 적용
      if (activeFilter.startDate && activeFilter.endDate) {
        const start = toStartOfDay(activeFilter.startDate);
        const end = toEndOfDay(activeFilter.endDate);
        result = result.filter(c => {
          const d = new Date(c.updatedAt);
          return d >= start && d <= end;
        });
      }

      // 진행 상태 (다중 선택, 하나도 선택 안 하면 전체)
      if (activeFilter.selectedStatuses.length > 0) {
        result = result.filter(c =>
          activeFilter.selectedStatuses.includes(
            c.consultStatus as ProgressStatus,
          ),
        );
      }
    }

    // 검색어
    if (schText.trim()) {
      const kw = schText.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(kw) ||
          (c.address ?? '').toLowerCase().includes(kw) ||
          (c.phone ?? '').includes(kw),
      );
    }

    setFiltered(result);
  }, [selectCategory, schText, allCustomers, activeFilter]);

  const handleApply = (f: FilterState) => {
    setFilter(f);
    setActiveFilter(f);
  };

  const handleFilterOpen = () => {
    // 시트 열 때 현재 activeFilter(또는 기본값)로 초기화
    setFilter(
      activeFilter ?? { startDate: '', endDate: '', selectedStatuses: [] },
    );
    setFilterVisible(true);
  };

  const handleFilterReset = () => {
    const defaultFilter = { startDate: '', endDate: '', selectedStatuses: [] };
    setFilter(defaultFilter);
    setActiveFilter(null);
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
          onSearchPress={() => {}}
        />
      </View>
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
        style={{ flexGrow: 0 }}
      >
        {/* 필터 버튼 — 활성 시 색상 변경 */}
        <TouchableOpacity
          onPress={handleFilterOpen}
          style={[
            styles.row,
            styles.filterBtn,
            isFilterActive && styles.filterBtnActive,
          ]}
        >
          <Image
            source={{ uri: BASE_URL + '/images/filter_icon.png' }}
            style={{ width: 16, height: 16, resizeMode: 'contain' }}
          />
          <CommonText
            labelText="필터"
            style={[
              fonts.medium,
              { color: isFilterActive ? colors.primary : colors.gray8 },
            ]}
          />
          {isFilterActive && (
            <TouchableOpacity
              onPress={handleFilterReset}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/refresh_gray.png' }}
                style={{
                  width: 10,
                  height: 10,
                  resizeMode: 'contain',
                  marginLeft: 2,
                }}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View style={{ height: 24, width: 1, backgroundColor: colors.gray2 }} />
        {['전체', '미열람', '열람'].map(cat => (
          <CategoryButton
            key={cat}
            onPress={() => setSelectCategory(cat)}
            buttonStats={selectCategory === cat}
            label={cat}
          />
        ))}
      </ScrollView>

      {/* 활성 필터 요약 표시 */}
      {isFilterActive && (
        <View style={styles.filterSummary}>
          <CommonText
            labelText={`${activeFilter!.startDate} ~ ${activeFilter!.endDate}${
              activeFilter!.selectedStatuses.length > 0
                ? `  ·  ${activeFilter!.selectedStatuses.join(', ')}`
                : ''
            }`}
            style={[fonts.medium, { fontSize: 12, color: colors.primary }]}
            numberOfLines={1}
          />
        </View>
      )}

      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        renderItem={({ item }) => (
          <ClientBox item={item} isViewVisible navigation={navigation} />
        )}
        keyExtractor={item => `${item.customerType}-${item.idx}`}
        ListEmptyComponent={
          <View style={styles.empty}>
            <CommonText
              labelText="조건에 맞는 고객이 없습니다."
              style={[fonts.medium, { color: colors.gray6, fontSize: 14 }]}
            />
          </View>
        }
      />

      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filter={filter}
        onApply={handleApply}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtn: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray3,
    gap: 4,
  },
  filterBtnActive: {
    borderColor: colors.primary2,
    backgroundColor: colors.primary3,
  },
  filterSummary: {
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.primary3,
    borderRadius: 8,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
});
