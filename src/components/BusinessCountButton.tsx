import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useAppDimensions } from '../hooks/useAppDimensions';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

interface Props {
  label: string;
  count: string;
  buttonStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function BusinessCountButton({
  label,
  count = '0',
  buttonStyle,
  onPress,
}: Props) {
  const { width } = useAppDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: (width - 42) / 3,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
          gap: 12,
        },
        buttonStyle,
      ]}
    >
      <CommonText labelText={label} style={[styles.businessText1]} />
      <CommonText labelText={count} style={[styles.businessText2]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  businessText1: {
    fontSize: 14,
    color: colors.gray8,
  },
  businessText2: {
    ...fonts.semiBold,
    fontSize: 20,
    color: colors.gray9,
  },
});
