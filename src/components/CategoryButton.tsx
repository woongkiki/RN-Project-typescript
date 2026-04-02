import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import CommonText from './CommonText';

interface Props {
  label: string;
  count?: string;
  onPress?: () => void;
  buttonStats?: boolean;
}

export default function CategoryButton({
  label = '',
  count = '',
  onPress,
  buttonStats,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.row,
        styles.categoryButton,
        buttonStats && { backgroundColor: colors.primary },
      ]}
    >
      <CommonText
        labelText={label}
        style={[
          styles.categoryButtonText,
          buttonStats && { color: colors.white },
          buttonStats && fonts.medium,
        ]}
      />
      {count != '' && (
        <CommonText
          labelText={count}
          style={[
            styles.categoryButtonText,
            buttonStats && { color: colors.white },
            buttonStats && fonts.semiBold,
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dbText: {
    fontSize: 15,
    color: colors.gray7,
  },
  categoryButton: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.gray1,
    gap: 4,
  },
  categoryButtonText: {
    ...fonts.medium,
    color: colors.gray8,
    fontSize: 14,
  },
});
