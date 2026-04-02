import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

interface MenuButtonProps {
  iconUri?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconWrapStyle?: StyleProp<ViewStyle>;
}

function IconBox({
  iconUri = 'https://picsum.photos/74',
  iconWidth = 32,
  iconHeight = 32,
  iconWrapStyle,
}: MenuButtonProps) {
  return (
    <View style={[styles.iconBox, iconWrapStyle]}>
      <Image
        source={{ uri: iconUri }}
        style={{
          width: iconWidth,
          height: iconHeight,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

export default IconBox;
