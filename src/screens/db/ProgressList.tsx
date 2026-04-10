import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CategoryButton from '../../components/CategoryButton';
import ClientBox from '../../components/ClientBox';
import { getCustomers } from '../../api/customer';
import { Customer } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'ProgressList'>;

const CATEGORIES = ['상담대기', '상담중', '계약완료', '부재', '재연락', '거절'];

export default function ProgressList({ route, navigation }: Props) {
  const { params } = route;

  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<Record<string, number>>({});
  const isInitialScroll = useRef(true);

  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [selectCategory, setSelectCategory] = useState(
    params?.cate === '' ? '상담대기' : params?.cate,
  );

  // 카테고리별 고객 수
  const countByStatus = (statusName: string) =>
    allCustomers.filter(c => c.consultStatus === statusName).length;

  useEffect(() => {
    getCustomers().then(setAllCustomers);
  }, []);

  useEffect(() => {
    setFiltered(allCustomers.filter(c => c.consultStatus === selectCategory));
  }, [selectCategory, allCustomers]);

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
        data={filtered}
        renderItem={({ item }) => (
          <ClientBox item={item} navigation={navigation} />
        )}
        keyExtractor={item => `${item.customerType}-${item.idx}`}
        ListEmptyComponent={
          <View style={styles.empty}>
            <CommonText
              labelText="고객이 없습니다."
              labelTextStyle={[fonts.medium, { fontSize: 14, color: colors.gray6 }]}
            />
          </View>
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  empty: { paddingTop: 60, alignItems: 'center' },
});

