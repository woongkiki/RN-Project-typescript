import React, { ReactNode } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';
import IconBox from './IconBox';

interface MenuButtonProps {
  iconUri?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconWrapStyle?: StyleProp<ViewStyle>;
  label?: string;
  onPress?: () => void;
}

function MenuButton({
  iconUri,
  label = '',
  iconWidth = 32,
  iconHeight = 32,
  iconWrapStyle,
  onPress,
}: MenuButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button]}>
      <IconBox
        iconUri={iconUri}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
        iconWrapStyle={iconWrapStyle}
      />
      <CommonText labelText={label} labelTextStyle={styles.labelText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: colors.gray0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  labelText: {
    ...fonts.medium,
    color: colors.gray9,
    fontSize: 14,
  },
});

export default MenuButton;
