import React from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

type Props = NativeStackScreenProps<MainStackParamList, 'SeminarInfo'>;

export default function SeminarInfo({ route, navigation }: Props) {
  const { params } = route;

  return (
    <Layout>
      <SubHeader
        headerLabel={''}
        headerLeftOnPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={{ padding: 20 }}>
          <View style={{ alignItems: 'flex-start', marginBottom: 15 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                backgroundColor: colors.primary3,
              }}
            >
              <CommonText
                labelText="모집중"
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 14, color: colors.primary },
                ]}
              />
            </View>
          </View>
          <CommonText
            labelText="[26.03] 클로징 세일즈 정공법 세미나 특강"
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 20, color: colors.gray10 },
            ]}
          />
          <View
            style={{
              width: '100%',
              height: 200,
              backgroundColor: colors.primary,
              marginTop: 20,
            }}
          />
          <View
            style={{
              gap: 30,
              marginTop: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
              paddingBottom: 20,
            }}
          >
            <View>
              <CommonText labelText="일시" labelTextStyle={[styles.label]} />
              <CommonText
                labelText="3월 16일(월) 11:30 ~ 3월 16일(월) 18:00"
                labelTextStyle={[styles.contents]}
              />
            </View>
            <View>
              <CommonText
                labelText="신청기한"
                labelTextStyle={[styles.label]}
              />
              <CommonText
                labelText="3월 15일(일) 22:00까지"
                labelTextStyle={[styles.contents]}
              />
            </View>
            <View>
              <CommonText
                labelText="모집인원"
                labelTextStyle={[styles.label]}
              />
              <CommonText labelText="50명" labelTextStyle={[styles.contents]} />
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <CommonText
            labelText="세미나 정보"
            labelTextStyle={[fonts.semiBold, { color: colors.gray10 }]}
          />
          <CommonText
            labelText={
              '[세미나 정보글]\n작성한 세미나 소개글이 보여집니다.\n작성한 세미나 소개글이 보여집니다.작성한 세미나 소개글이 보여집니다.작성한 세미나 소개글이 보여집니다.작성한 세미나 소개글이 보여집니다'
            }
            labelTextStyle={[
              fonts.regular,
              {
                color: colors.gray8,
                lineHeight: 20,
                fontSize: 15,
                marginTop: 15,
              },
            ]}
          />
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: colors.gray1,
        }}
      >
        <TouchableOpacity
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonText
            labelText="신청하기"
            labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: colors.gray7,
  },
  contents: {
    fontSize: 16,
    color: colors.gray9,
    ...fonts.medium,
    marginTop: 12,
  },
});
