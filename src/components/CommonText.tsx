import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';
import { fonts } from '../constants/fonts';

interface Props extends TextProps {
  labelText: string;
  numberOfLines?: number;
  labelTextStyle?: StyleProp<TextStyle>;
}

export default function CommonText({
  labelText,
  labelTextStyle,
  numberOfLines = 0,
  ...rest
}: Props) {
  return (
    <Text
      allowFontScaling={false}
      style={[styles.label, labelTextStyle]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {labelText}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...fonts.regular,
    fontSize: 16,
  },
});
