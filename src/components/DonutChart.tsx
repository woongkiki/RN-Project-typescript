import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors';

interface DonutChartProps {
  value: number; // 현재값
  total: number; // 전체값
  unit?: 'percent' | 'fraction'; // 표시 형식
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
}

function DonutChart({
  value,
  total,
  unit = 'fraction',
  size = 80,
  strokeWidth = 15,
  color = '#2196F3',
  label,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / total;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  const displayText =
    unit === 'percent' ? `${Math.round(progress * 100)}%` : `${value}/${total}`;

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* 배경 트랙 */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* 진행 원 */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>
        {/* 중앙 텍스트 */}
        <View style={[StyleSheet.absoluteFill, styles.centerText]}>
          <CommonText
            labelText={displayText}
            labelTextStyle={[
              fonts.semiBold,
              { color: colors.gray9, fontSize: 14 },
            ]}
          />
        </View>
      </View>
      <CommonText labelText={label} style={styles.label} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 10,
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111',
  },
  label: {
    fontSize: 15,
    color: colors.gray9,
    ...fonts.medium,
  },
});

export default DonutChart;
