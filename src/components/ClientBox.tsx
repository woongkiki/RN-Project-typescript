// components/ClientBox.tsx
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useAppDimensions } from '../hooks/useAppDimensions';
import CommonText from './CommonText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../navigation/types';
import { BASE_URL } from '../api/util';

type ClientItem = {
  idx: number;
  name: string;
  age: string;
  gender: string;
  address: string;
  date?: string;
  time?: string;
  isView?: boolean;
  isViewVisible?: boolean;
};

interface Props {
  item: ClientItem;
  onPress?: () => void;
  isViewVisible?: boolean;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    keyof MainStackParamList
  >;
}

export default function ClientBox({
  item,
  onPress,
  isViewVisible = false,
  navigation,
}: Props) {
  const { width } = useAppDimensions();

  const infoMove = () => {
    navigation.navigate('CustomerInfo', { idx: '1' });
  };

  return (
    <TouchableOpacity
      onPress={infoMove}
      style={{ paddingHorizontal: 20 }}
      //onPress={onPress}
    >
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
                  backgroundColor: item.isView ? colors.primary : colors.gray1,
                  borderRadius: 4,
                }}
              >
                <CommonText
                  labelText={item.isView ? '열람' : '미열람'}
                  style={[
                    fonts.semiBold,
                    {
                      color: item.isView ? colors.white : colors.gray6,
                      fontSize: 11,
                    },
                  ]}
                />
              </View>
            </View>
          )}
          <View style={[styles.row]}>
            <CommonText
              labelText={item.name}
              style={[
                fonts.semiBold,
                styles.dbText,
                { color: colors.gray10, marginRight: 5 },
              ]}
            />
            <CommonText labelText={item.age} style={[styles.dbText]} />
            <CommonText
              labelText={'·'}
              style={[styles.dbText, { marginHorizontal: 3 }]}
            />
            <CommonText labelText={item.gender} style={[styles.dbText]} />
          </View>
          <View style={{ marginTop: 15 }}>
            {item.date && item.time && (
              <View style={[styles.row, { gap: 7, marginBottom: 10 }]}>
                <Image
                  source={{ uri: BASE_URL + '/images/calendar_gray.png' }}
                  style={{ width: 10, height: 10, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText={item.date}
                  style={{ fontSize: 13, color: colors.gray7 }}
                />
                <View
                  style={{ height: 8, width: 2, backgroundColor: colors.gray3 }}
                />
                <CommonText
                  labelText={item.time}
                  style={{ fontSize: 13, color: colors.gray7 }}
                />
              </View>
            )}
            <View style={[styles.row, { gap: 5 }]}>
              <Image
                source={{ uri: BASE_URL + '/images/address_icon_gray.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
              <CommonText
                labelText={item.address}
                style={{ fontSize: 13, color: colors.gray7 }}
              />
            </View>
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
