import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppDimensions } from '../hooks/useAppDimensions';
import { colors } from '../constants/colors';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type BoardItem = {
  idx: number;
  title: string;
  category: string;
  date: string;
  isNew?: boolean;
};

interface Props {
  item: BoardItem;
  onPress?: () => void;
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    keyof MainStackParamList
  >;
}

function BoardCommon({
  item,
  onPress = () =>
    navigation.navigate('BoardInfo', { idx: item.idx.toString() }),
  navigation,
}: Props) {
  const { width } = useAppDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: width - 40,
        paddingVertical: 17,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray1,
      }}
    >
      <View style={[styles.horizontalBox, { marginBottom: 15 }]}>
        {item?.isNew && (
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 2,
              backgroundColor: colors.mainRed,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 3,
              marginRight: 5,
            }}
          >
            <CommonText
              labelText="N"
              labelTextStyle={[
                fonts.bold,
                { fontSize: 12, color: colors.white },
              ]}
            />
          </View>
        )}
        <View style={[styles.horizontalBox]}>
          {item?.category != '' && (
            <View
              style={{
                maxWidth: item?.isNew ? (width - 56) * 0.2 : (width - 40) * 0.2,
                marginRight: 5,
              }}
            >
              <CommonText
                labelText={'[' + item?.category + ']'}
                style={[styles.borderTitle, { color: colors.gray7 }]}
              />
            </View>
          )}

          <View
            style={{
              width:
                item?.category != ''
                  ? (width - 56) * 0.75
                  : item?.isNew
                  ? width - 56
                  : width - 40,
            }}
          >
            <CommonText
              labelText={item.title}
              style={[styles.borderTitle, { color: colors.gray10 }]}
              numberOfLines={1}
            />
          </View>
        </View>
      </View>
      <CommonText
        labelText={item.date}
        style={[fonts.regular, { fontSize: 13, color: colors.gray6 }]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalBox: {
    flexDirection: 'row',
    flex: 1,
  },
  boardWrap: {
    padding: 20,
  },
  borderTitle: {
    ...fonts.medium,
    fontSize: 16,
  },
});

export default BoardCommon;
