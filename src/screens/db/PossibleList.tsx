import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FlatList, StyleSheet, View } from 'react-native';
import SubHeader from '../../components/SubHeader';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchInput from '../../components/SearchInput';
import ClientBox from '../../components/ClientBox';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { getCustomers } from '../../api/customer';
import { Customer } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'PossibleList'>;

export default function PossibleList({ navigation }: Props) {
  const [schText, setSchText] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);

  useEffect(() => {
    getCustomers({ consultStatus: '상담대기' }).then(data => {
      setCustomers(data);
      setFiltered(data);
    });
  }, []);

  const handleSearch = () => {
    if (!schText.trim()) {
      setFiltered(customers);
      return;
    }
    const kw = schText.toLowerCase();
    setFiltered(
      customers.filter(
        c =>
          c.name.toLowerCase().includes(kw) ||
          (c.address ?? '').toLowerCase().includes(kw) ||
          (c.phone ?? '').includes(kw),
      ),
    );
  };

  useEffect(() => {
    if (!schText.trim()) setFiltered(customers);
  }, [schText, customers]);

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
          onSearchPress={handleSearch}
        />
      </View>
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
