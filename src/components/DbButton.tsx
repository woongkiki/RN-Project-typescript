import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useAppDimensions } from '../hooks/useAppDimensions';
import { fonts } from '../constants/fonts';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import IconBox from './IconBox';

interface Props {
  label: string;
  labelStyle?: StyleProp<ViewStyle>;
  iconUri?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconWrapStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

function DbButton({
  label,
  labelStyle,
  iconUri,
  iconWidth = 22,
  iconHeight = 20,
  iconWrapStyle,
  onPress,
}: Props) {
  const { width } = useAppDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.boxShadow,
        {
          width: (width - 50) / 2,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 12,
        },
      ]}
    >
      <CommonText
        labelText={label}
        style={[
          fonts.semiBold,
          { fontSize: 16, color: colors.gray10 },
          labelStyle,
        ]}
      />
      <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
        <IconBox
          iconWrapStyle={[{ width: 42, height: 42 }, iconWrapStyle]}
          iconUri={iconUri}
          iconWidth={iconWidth}
          iconHeight={iconHeight}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    // iOS 그림자
    shadowColor: Platform.OS == 'ios' ? 'rgba(175, 176, 180, 0.3)' : '#AFB0B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8,
    shadowRadius: 8,

    // Android 그림자
    elevation: 5,
  },
});

export default DbButton;
