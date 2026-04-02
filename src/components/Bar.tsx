import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppDimensions } from '../hooks/useAppDimensions';
import { colors } from '../constants/colors';

function Bar() {
  const { width } = useAppDimensions();

  return <View style={[styles.barStyle, { width: width }]} />;
}

const styles = StyleSheet.create({
  barStyle: {
    height: 8,
    backgroundColor: colors.gray2,
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
  },
});

export default Bar;
