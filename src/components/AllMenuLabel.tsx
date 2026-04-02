// components/AllMenuLabel.tsx

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  useWindowDimensions,
  View,
} from 'react-native';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

interface AllMenuLabelProps {
  imageSource: ImageSourcePropType;
  labelText: string;
  labelTextStyle?: StyleProp<TextStyle>;
  iconWidth?: number;
  iconHeight?: number;
}

const AllMenuLabel = ({
  imageSource,
  labelText,
  labelTextStyle,
  iconWidth = 13,
  iconHeight = 16,
}: AllMenuLabelProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View
        style={{
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.gray1,
          borderRadius: 6,
        }}
      >
        <Image
          source={imageSource}
          style={{
            width: iconWidth,
            height: iconHeight,
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={{ width: width - 70 }}>
        <CommonText
          labelText={labelText}
          labelTextStyle={[
            fonts.bold,
            { color: colors.gray10, fontSize: 18 },
            labelTextStyle,
          ]}
        />
      </View>
    </View>
  );
};

export default AllMenuLabel;
