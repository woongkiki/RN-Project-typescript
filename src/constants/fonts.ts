import { Platform, TextStyle } from 'react-native';

const FontFamily = {
  black: 'Pretendard-Black',
  extraBold: 'Pretendard-ExtraBold',
  bold: 'Pretendard-Bold',
  semiBold: 'Pretendard-SemiBold',
  medium: 'Pretendard-Medium',
  regular: 'Pretendard-Regular',
  light: 'Pretendard-Light',
  extraLight: 'Pretendard-ExtraLight',
  thin: 'Pretendard-Thin',
} as const;

const createFont = (fontFamily: string): TextStyle => ({
  fontFamily,
});

export const fonts = {
  black: createFont('Pretendard-Black'),
  extraBold: createFont('Pretendard-ExtraBold'),
  bold: createFont('Pretendard-Bold'),
  semiBold: createFont('Pretendard-SemiBold'),
  medium: createFont('Pretendard-Medium'),
  regular: createFont('Pretendard-Regular'),
  light: createFont('Pretendard-Light'),
  extraLight: createFont('Pretendard-ExtraLight'),
  thin: createFont('Pretendard-Thin'),
} as const;
