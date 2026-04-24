// components/ClientBox.tsx
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useAppDimensions } from '../hooks/useAppDimensions';
import CommonText from './CommonText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { BASE_URL } from '../api/util';
import { Customer } from '../types';

interface Props {
  item: Customer;
  onPress?: () => void;
  isViewVisible?: boolean; // AllList 전용: 열람/미열람 뱃지
  nextConsultDate?: string; // 다음 상담일 (선택)
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    keyof MainStackParamList
  >;
}

export default function ClientBox({
  item,
  isViewVisible = false,
  nextConsultDate,
  navigation,
}: Props) {
  const { width } = useAppDimensions();

  const infoMove = () => {
    navigation.navigate('CustomerInfo', {
      idx: String(item.idx),
      customerType: item.customerType,
    });
  };

  return (
    <TouchableOpacity onPress={infoMove} style={{ paddingHorizontal: 20 }}>
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            paddingVertical: 20,
            paddingHorizontal: 5,
            borderTopWidth: 1,
            borderTopColor: colors.gray1,
          },
        ]}
      >
        <View style={{ width: width - 60 }}>
          {isViewVisible && (
            <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 6,
                  backgroundColor: item.isOpen ? colors.primary : colors.gray1,
                  borderRadius: 4,
                }}
              >
                <CommonText
                  labelText={item.isOpen ? '열람' : '미열람'}
                  style={[
                    fonts.semiBold,
                    {
                      color: item.isOpen ? colors.white : colors.gray6,
                      fontSize: 11,
                    },
                  ]}
                />
              </View>
            </View>
          )}
          <View style={[styles.row, { gap: 8 }]}>
            <CommonText
              labelText={item.name}
              style={[fonts.semiBold, styles.dbText, { color: colors.gray10 }]}
            />
            {(item.age != null || item.gender != null) && (
              <View>
                <CommonText
                  labelText={[item.age, item.gender]
                    .filter(v => v != null)
                    .join(' · ')}
                  style={[fonts.regular, { fontSize: 15, color: colors.gray7 }]}
                />
              </View>
            )}
          </View>
          <View style={{ gap: 8 }}>
            {nextConsultDate && (
              <View style={[styles.row, { gap: 7 }]}>
                <Image
                  source={{ uri: BASE_URL + '/images/calendar_gray.png' }}
                  style={{ width: 10, height: 10, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText={nextConsultDate}
                  style={{ fontSize: 13, color: colors.gray7 }}
                />
              </View>
            )}
            {/* {item.phone && (
              <View style={[styles.row, { gap: 5 }]}>
                <Image
                  source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                  style={{ width: 10, height: 10, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText={item.phone}
                  style={{ fontSize: 13, color: colors.gray7 }}
                />
              </View>
            )} */}
            {item.address && (
              <View style={[styles.row, { gap: 5, marginTop: 12 }]}>
                <Image
                  source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                  style={{ width: 10, height: 10, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText={item.address}
                  style={{ fontSize: 13, color: colors.gray7 }}
                  numberOfLines={1}
                />
              </View>
            )}
          </View>
        </View>
        <Image
          source={{ uri: BASE_URL + '/images/gray_arr.png' }}
          style={{ width: 10, height: 10, resizeMode: 'contain' }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dbText: {
    fontSize: 15,
    color: colors.gray7,
  },
});
