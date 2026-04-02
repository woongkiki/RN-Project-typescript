// hooks/useAppDimensions.ts
import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 768;
const FOLD_BREAKPOINT = 600; // 갤럭시 폴드 펼쳤을 때 기준

export function useAppDimensions() {
  const { width, height, fontScale } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= TABLET_BREAKPOINT;
  const isFolded = width >= FOLD_BREAKPOINT; // 폴더블 펼침 상태

  return {
    width,
    height,
    fontScale,
    isLandscape,
    isTablet,
    isFolded,
  };
}
