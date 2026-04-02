import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';

interface Props {
  headerLabel: string;
  headerLabelTextStyle?: StyleProp<TextStyle>;
  headerRightVisible?: boolean;
  headerRightContent?: ReactNode;
}

export default function MainHeader({
  headerLabel,
  headerLabelTextStyle,
  headerRightVisible = true,
  headerRightContent,
}: Props) {
  return (
    <View style={styles.headerBox}>
      <CommonText
        labelText={headerLabel}
        labelTextStyle={[styles.headerLabel, headerLabelTextStyle]}
      />
      {headerRightVisible && <View>{headerRightContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    width: '100%',
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 20,
    ...fonts.bold,
  },
});
