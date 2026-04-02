import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';

interface Props extends TextInputProps {
  inputStyle?: StyleProp<TextStyle>;
}

export default function CommonInput({ inputStyle, ...rest }: Props) {
  return (
    <TextInput
      allowFontScaling={false}
      style={[{ width: '100%', height: 50 }, styles.input, inputStyle]}
      placeholderTextColor="#AAAAAA"
      autoCapitalize="none"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F6F9',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
});
