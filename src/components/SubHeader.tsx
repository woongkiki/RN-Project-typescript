import React, { ReactNode } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors';
import { BASE_URL } from '../api/util';

interface Props {
  headerLabel: string;
  headerLabelText?: StyleProp<TextStyle>;
  headerLeftVisible?: boolean;
  headerLeftOnPress?: () => void;
  headerRightVisible?: boolean;
  headerRightContent?: ReactNode;
  headerRightWrapStyle?: StyleProp<ViewStyle>;
}

export default function SubHeader({
  headerLabel,
  headerLabelText,
  headerLeftVisible = true,
  headerLeftOnPress = () => {},
  headerRightVisible = false,
  headerRightContent,
  headerRightWrapStyle,
}: Props) {
  return (
    <View style={styles.headerBox}>
      <CommonText
        labelText={headerLabel}
        labelTextStyle={[styles.headerLabel, headerLabelText]}
      />
      {headerLeftVisible && (
        <TouchableOpacity onPress={headerLeftOnPress} style={styles.leftButton}>
          <Image
            source={{ uri: BASE_URL + '/images/back_btn_arr.png' }}
            style={{ width: 18, height: 14, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      )}
      {headerRightVisible && (
        <View style={[styles.rightButton, headerRightWrapStyle]}>
          {headerRightContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    ...fonts.bold,
    color: colors.gray10,
    fontSize: 18,
  },
  leftButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    left: 20,
    top: 0,
  },
  rightButton: {
    minWidth: 48,
    height: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
    // backgroundColor: 'pink',
    position: 'absolute',
    right: 20,
    top: 0,
  },
  backText: { fontSize: 16 },
});
