import React, { useState } from 'react';
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import CommonText from './CommonText';
import SearchInput from './SearchInput';

interface Customer {
  idx: string;
  name: string;
  phone: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

// 목데이터 - 추후 API 연동 시 교체
const MOCK_CUSTOMERS: Customer[] = [
  { idx: '1', name: '홍길동', phone: '010-1234-5678' },
  { idx: '2', name: '김철수', phone: '010-2345-6789' },
  { idx: '3', name: '이영희', phone: '010-3456-7890' },
  { idx: '4', name: '박민준', phone: '010-4567-8901' },
  { idx: '5', name: '최지원', phone: '010-5678-9012' },
  { idx: '6', name: '정수현', phone: '010-6789-0123' },
];

export default function CustomerSearchModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const [searchText, setSearchText] = useState('');

  const filteredList = MOCK_CUSTOMERS.filter(
    c => c.name.includes(searchText) || c.phone.includes(searchText),
  );

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setSearchText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
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
          <FlatList
            data={filteredList}
            keyExtractor={item => item.idx}
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
                  <CommonText
                    labelText={item.phone}
                    labelTextStyle={[{ fontSize: 13, color: colors.gray6 }]}
                  />
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
