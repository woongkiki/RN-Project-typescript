import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useAppDimensions } from '../hooks/useAppDimensions';
import CommonInput from './CommonInput';
import { BASE_URL } from '../api/util';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  onSearchPress?: () => void;
  inputStyle?: StyleProp<TextStyle>;
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder = '검색하세요',
  placeholderTextColor = colors.gray6,
  onSearchPress,
  inputStyle,
  ...rest
}: Props) {
  const { width } = useAppDimensions();

  return (
    <View style={styles.row}>
      <CommonInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        inputStyle={[
          {
            width: width - 82,
            height: 42,
            fontSize: 14,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          inputStyle,
        ]}
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
        <Image
          source={{ uri: BASE_URL + '/images/search_icon_blue.png' }}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    width: 42,
    height: 42,
    backgroundColor: colors.gray1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
});
