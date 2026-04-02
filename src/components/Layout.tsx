import React, { ReactNode } from 'react';
import {
  StyleSheet,
  StatusBar,
  StyleProp,
  ViewStyle,
  ScrollView,
  View,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useAppDimensions } from '../hooks/useAppDimensions';

interface Props {
  headerChildren?: ReactNode;
  footerChildren?: ReactNode;
  children: ReactNode;
  keyboardViewStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  scrollViewStyle?: StyleProp<ViewStyle>; // ScrollView 컨테이너 style
  scrollViewContentStyle?: StyleProp<ViewStyle>; // ✅ contentContainerStyle 추가
  fixViewStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  behavior?: 'padding' | 'height' | 'position';
}

export default function Layout({
  headerChildren,
  footerChildren,
  children,
  keyboardViewStyle,
  scrollable = false,
  scrollViewStyle,
  scrollViewContentStyle,
  fixViewStyle,
  edges = ['top', 'bottom'],
  behavior = 'padding',
}: Props) {
  const { isFolded, isTablet } = useAppDimensions();

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
      <KeyboardAvoidingView
        style={[
          styles.keyboardView,
          (isTablet || isFolded) && styles.tabletView,
          keyboardViewStyle,
        ]}
        behavior={behavior}
      >
        {headerChildren}
        {scrollable ? (
          <ScrollView
            style={[styles.scrollView, scrollViewStyle]}
            contentContainerStyle={scrollViewContentStyle} // ✅ 추가
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, fixViewStyle]}>{children}</View>
        )}
        {footerChildren}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  tabletView: { maxWidth: 600, alignSelf: 'center', width: '100%' },
});
