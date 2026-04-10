// components/VideoListItem.tsx
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useAppDimensions } from '../hooks/useAppDimensions';

type VideoItem = {
  idx: number;
  title: string;
  content: string;
  thumb: string;
  date: string;
  isEnd: boolean;
};

type Props = {
  item: VideoItem;
  index: number;
  onPress?: () => void;
};

export default function VideoListItem({ item, index, onPress }: Props) {
  const { width } = useAppDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.row,
        {
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: index !== 0 ? 30 : 10,
        },
      ]}
    >
      {item.thumb ? (
        <Image
          source={{ uri: item.thumb }}
          style={{ width: 128, height: '100%', resizeMode: 'stretch', borderRadius: 10 }}
        />
      ) : (
        <View style={{ width: 128, height: 80, borderRadius: 10, backgroundColor: colors.gray2 }} />
      )}
      <View style={{ width: width - 180, gap: 10, paddingVertical: 5 }}>
        <View
          style={[
            styles.row,
            { alignItems: 'center', justifyContent: 'space-between' },
          ]}
        >
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 5,
              borderRadius: 4,
              backgroundColor: item.isEnd ? colors.primary3 : colors.gray1,
            }}
          >
            <CommonText
              labelText={item.isEnd ? '교육완료' : '미완료'}
              labelTextStyle={[
                fonts.semiBold,
                {
                  fontSize: 11,
                  color: item.isEnd ? colors.primary : colors.gray6,
                },
              ]}
            />
          </View>
          <CommonText
            labelText={item.date}
            labelTextStyle={[{ fontSize: 12, color: colors.gray6 }]}
          />
        </View>
        <CommonText
          labelText={item.title}
          labelTextStyle={[fonts.semiBold, { color: colors.gray10 }]}
        />
        <CommonText
          labelText={item.content}
          numberOfLines={1}
          labelTextStyle={[{ fontSize: 14, color: colors.gray7 }]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
