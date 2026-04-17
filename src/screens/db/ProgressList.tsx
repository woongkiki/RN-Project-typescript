import React, { useCallback, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import CategoryButton from '../../components/CategoryButton';
import ClientBox from '../../components/ClientBox';
import { getCustomers, getCustomersPaged } from '../../api/customer';
import { Customer } from '../../types';
import { useAuthStore } from '../../store';

type Props = NativeStackScreenProps<MainStackParamList, 'ProgressList'>;

const CATEGORIES = ['상담대기', '상담중', '계약완료', '부재', '재연락', '거절'];
const PAGE_LIMIT = 20;

export default function ProgressList({ route, navigation }: Props) {
  const { params } = route;
  const user = useAuthStore(state => state.user);

  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<Record<string, number>>({});
  const isInitialScroll = useRef(true);
  const isFetchingRef = useRef(false);

  const [selectCategory, setSelectCategory] = useState(
    params?.cate === '' ? '상담대기' : params?.cate,
  );

  // 카테고리 뱃지용 전체 고객 (별도 로드)
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);

  // 페이징용 표시 목록
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const countByStatus = (statusName: string) =>
    allCustomers.filter(c => c.consultStatus === statusName).length;

  const fetchCustomers = useCallback(async (targetPage: number, reset: boolean) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const res = await getCustomersPaged({
        consultStatus: selectCategory ?? '상담대기',
        assignedAccountIdx: user?.idx ?? undefined,
        page: targetPage,
        limit: PAGE_LIMIT,
      });
      setTotal(res.total);
      setCustomers(prev => (reset ? res.customers : [...prev, ...res.customers]));
      setPage(targetPage);
    } catch (e: any) {
      console.log('[customers error]', e?.message);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [selectCategory]);

  useFocusEffect(
    useCallback(() => {
      if (user?.idx) {
        getCustomers({ assignedAccountIdx: user.idx }).then(setAllCustomers).catch(() => {});
      }
      fetchCustomers(1, true);
    }, [fetchCustomers, user?.idx]),
  );

  const handleLoadMore = () => {
    if (!isLoading && customers.length < total) {
      fetchCustomers(page + 1, false);
    }
  };

  const handleLayout = (cate: string, x: number) => {
    itemPositions.current[cate] = x;
    if (isInitialScroll.current && cate === selectCategory) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: Math.max(0, x - 20), animated: false });
        isInitialScroll.current = false;
      }, 50);
    }
  };

  useEffect(() => {
    if (isInitialScroll.current) return;
    const x = itemPositions.current[selectCategory ?? '상담대기'];
    if (x !== undefined) {
      scrollViewRef.current?.scrollTo({ x: Math.max(0, x - 20), animated: true });
    }
  }, [selectCategory]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="진행 중인 업무"
        headerLeftOnPress={() => navigation.goBack()}
      />
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
        style={{ flexGrow: 0 }}
      >
        {CATEGORIES.map(cat => (
          <View
            key={cat}
            onLayout={e => handleLayout(cat, e.nativeEvent.layout.x)}
          >
            <CategoryButton
              onPress={() => setSelectCategory(cat)}
              buttonStats={selectCategory === cat}
              label={cat}
              count={String(countByStatus(cat))}
            />
          </View>
        ))}
      </ScrollView>
      <FlatList
        style={{ flex: 1 }}
        data={customers}
        renderItem={({ item }) => (
          <ClientBox item={item} navigation={navigation} />
        )}
        keyExtractor={item => `${item.customerType}-${item.idx}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <CommonText
                labelText="고객이 없습니다."
                labelTextStyle={[fonts.medium, { fontSize: 14, color: colors.gray6 }]}
              />
            </View>
          ) : null
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  empty: { paddingTop: 60, alignItems: 'center' },
});
