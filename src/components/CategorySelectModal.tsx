import React from 'react';
import { Image, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { BASE_URL } from '../api/util';

interface CategorySelectModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelect: (category: string) => void;
  categories: string[];
  title?: string;
}

const CategoryModalContent = ({
  onClose,
  selectedCategory,
  onSelect,
  categories,
  title = '카테고리 선택',
}: Omit<CategorySelectModalProps, 'visible'>) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom,
          maxHeight: '70%',
        }}
      >
        {/* 헤더 */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.gray3,
              marginBottom: 12,
            }}
          />
          <CommonText
            labelText={title}
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 18, color: colors.gray10 },
            ]}
          />
        </View>

        {/* 목록 */}
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category}
              onPress={() => {
                onSelect(category);
                onClose();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < categories.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray1,
                backgroundColor:
                  selectedCategory === category
                    ? colors.primary3
                    : colors.white,
              }}
            >
              <CommonText
                labelText={category}
                labelTextStyle={[
                  fonts.medium,
                  { fontSize: 16 },
                  selectedCategory === category && {
                    color: colors.primary,
                    ...fonts.semiBold,
                  },
                ]}
              />
              {selectedCategory === category && (
                <Image
                  source={{ uri: BASE_URL + '/images/check_icon_blue.png' }}
                  style={{ width: 16, height: 16, resizeMode: 'contain' }}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function CategorySelectModal({
  visible,
  onClose,
  selectedCategory,
  onSelect,
  categories,
  title,
}: CategorySelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <CategoryModalContent
          onClose={onClose}
          selectedCategory={selectedCategory}
          onSelect={onSelect}
          categories={categories}
          title={title}
        />
      </SafeAreaProvider>
    </Modal>
  );
}
