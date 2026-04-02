import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';

interface Props extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export default function CommonButton({
  label,
  loading = false,
  buttonStyle,
  labelStyle,
  disabled,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.disabled,
        buttonStyle,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <CommonText
          labelText={label}
          labelTextStyle={[styles.label, labelStyle]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#008BEF',
    height: 52,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    ...fonts.semiBold,
  },
});
