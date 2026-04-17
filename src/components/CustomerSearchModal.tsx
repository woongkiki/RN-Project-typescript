import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import CommonText from './CommonText';
import SearchInput from './SearchInput';
import { getCustomers } from '../api/customer';
import { Customer } from '../types';
import { useAuthStore } from '../store';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

export default function CustomerSearchModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const user = useAuthStore(state => state.user);
  const [searchText, setSearchText] = useState('');
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 열릴 때 고객 목록 로드
  useEffect(() => {
    if (!visible || !user?.idx) return;
    setLoading(true);
    getCustomers({ assignedAccountIdx: user.idx })
      .then(data => setAllCustomers(data))
      .catch(() => setAllCustomers([]))
      .finally(() => setLoading(false));
  }, [visible, user?.idx]);

  const filteredList = allCustomers.filter(c => {
    const kw = searchText.trim().toLowerCase();
    if (!kw) return true;
    return (
      c.name.toLowerCase().includes(kw) ||
      (c.phone ?? '').includes(kw)
    );
  });

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setSearchText('');
    onClose();
  };

  const handleClose = () => {
    setSearchText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <CommonText
              labelText="고객 검색"
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 18, color: colors.gray10 },
              ]}
            />
          </View>

          {/* 검색창 */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            <SearchInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="고객명, 전화번호를 검색하세요"
              onSearchPress={() => {}}
            />
          </View>

          {/* 리스트 */}
          {loading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={filteredList}
              keyExtractor={item => `${item.customerType}-${item.idx}`}
              style={{ flex: 1 }}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <CommonText
                    labelText="검색 결과가 없습니다."
                    labelTextStyle={[{ fontSize: 15, color: colors.gray5 }]}
                  />
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={{ gap: 5 }}>
                    <CommonText
                      labelText={item.name}
                      labelTextStyle={[
                        fonts.semiBold,
                        { fontSize: 16, color: colors.gray10 },
                      ]}
                    />
                    {item.phone ? (
                      <CommonText
                        labelText={item.phone}
                        labelTextStyle={[{ fontSize: 13, color: colors.gray6 }]}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.gray1,
                    marginHorizontal: 20,
                  }}
                />
              )}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '70%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
    marginBottom: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray3,
    marginBottom: 12,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 40,
  },
});
