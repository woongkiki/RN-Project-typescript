import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { getSeminarPost } from '../../api/board';
import { SeminarPost } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'SeminarInfo'>;

const toDatetime = (iso: string) => {
  const d = new Date(iso);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${days[d.getDay()]}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const toDeadline = (iso: string) => {
  const d = new Date(iso);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${days[d.getDay()]}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}까지`;
};

export default function SeminarInfo({ route, navigation }: Props) {
  const { idx } = route.params;

  const [seminar, setSeminar] = useState<SeminarPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeminarPost(Number(idx))
      .then(setSeminar)
      .catch(() => Alert.alert('오류', '세미나 정보를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [idx]);

  if (loading) {
    return (
      <Layout>
        <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* 상태 뱃지 */}
          <View style={{ alignItems: 'flex-start', marginBottom: 15 }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                backgroundColor: seminar?.isFull ? colors.gray1 : colors.primary3,
              }}
            >
              <CommonText
                labelText={seminar?.isFull ? '정원마감' : '모집중'}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 14, color: seminar?.isFull ? colors.gray6 : colors.primary },
                ]}
              />
            </View>
          </View>

          {/* 제목 */}
          <CommonText
            labelText={seminar?.title ?? ''}
            labelTextStyle={[fonts.semiBold, { fontSize: 20, color: colors.gray10 }]}
          />

          {/* 썸네일 */}
          <Image
            source={{ uri: seminar?.thumbnailUrl }}
            style={{ width: '100%', height: 200, borderRadius: 10, marginTop: 20, backgroundColor: colors.gray1 }}
            resizeMode="cover"
          />

          {/* 세미나 정보 */}
          <View style={{ gap: 30, marginTop: 20, borderBottomWidth: 1, borderBottomColor: colors.gray1, paddingBottom: 20 }}>
            <View>
              <CommonText labelText="일시" labelTextStyle={[styles.label]} />
              <CommonText
                labelText={seminar ? `${toDatetime(seminar.startAt)} ~ ${toDatetime(seminar.endAt)}` : ''}
                labelTextStyle={[styles.contents]}
              />
            </View>
            <View>
              <CommonText labelText="신청기한" labelTextStyle={[styles.label]} />
              <CommonText
                labelText={seminar ? toDeadline(seminar.deadline) : ''}
                labelTextStyle={[styles.contents]}
              />
            </View>
            <View>
              <CommonText labelText="모집인원" labelTextStyle={[styles.label]} />
              <CommonText
                labelText={seminar ? `${seminar.capacity}명 (신청 ${seminar.registeredCount}명)` : ''}
                labelTextStyle={[styles.contents]}
              />
            </View>
          </View>
        </View>

        {/* 세미나 소개 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <CommonText labelText="세미나 정보" labelTextStyle={[fonts.semiBold, { color: colors.gray10 }]} />
          <CommonText
            labelText={seminar?.description ?? ''}
            labelTextStyle={[fonts.regular, { color: colors.gray8, lineHeight: 20, fontSize: 15, marginTop: 15 }]}
          />
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.gray1 }}>
        <TouchableOpacity
          disabled={seminar?.isFull}
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: seminar?.isFull ? colors.gray3 : colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonText
            labelText={seminar?.isFull ? '정원마감' : '신청하기'}
            labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray7 },
  contents: { fontSize: 16, color: colors.gray9, ...fonts.medium, marginTop: 12 },
});
