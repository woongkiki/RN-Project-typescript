import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors';
import { useAppDimensions } from '../hooks/useAppDimensions';

interface ProgressProps {
  value: number; // 현재값
  total: number; // 전체값
  strokeWidth?: number;
  color?: string;
  label: string;
}

function ProgressBox({
  value,
  total,
  strokeWidth = 15,
  color = '#2196F3',
  label = 'DB 진행률',
}: ProgressProps) {
  const { width } = useAppDimensions();

  let percent = total > 0 ? Math.floor((value / total) * 100) : 0;

  return (
    <View
      style={{
        width: (width - 95) / 2,
        backgroundColor: colors.white,
        paddingVertical: 17,
        paddingHorizontal: 15,
        borderRadius: 12,
        // iOS 그림자
        shadowColor: 'rgba(175, 176, 180, 0.15)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 15,
        shadowRadius: 9,

        // Android 그림자
        elevation: 3,
      }}
    >
      <CommonText
        labelText={label}
        style={[fonts.medium, { color: colors.gray9 }]}
      />
      <View style={[styles.row, { marginTop: 12 }]}>
        <View
          style={{
            width: '65%',
            height: 10,
            backgroundColor: '#E4ECF3',
            borderRadius: 4,
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${percent}%`, // 문자열 '%'로 직접
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: colors.primary,
              borderRadius: 4,
            }}
          />
        </View>
        <View
          style={[
            styles.row,
            {
              width: '35%',
              justifyContent: 'flex-end',
            },
          ]}
        >
          <CommonText
            labelText={value.toString()}
            style={[fonts.semiBold, { fontSize: 14, color: colors.primary }]}
          />
          <CommonText
            labelText={'/' + total}
            style={[{ fontSize: 14, color: colors.gray8 }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProgressBox;
