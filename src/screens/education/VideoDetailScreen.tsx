import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<MainStackParamList, 'VideoDetailScreen'>;

export default function VideoDetailScreen({ route, navigation }: Props) {
  const { params } = route;

  const { width } = useAppDimensions();

  const [playing, setPlaying] = useState(false);

  // ✅ 스크린을 벗어나면 자동 정지
  useFocusEffect(
    useCallback(() => {
      return () => {
        setPlaying(false);
      };
    }, []),
  );

  return (
    <Layout>
      <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
      <ScrollView>
        <YoutubePlayer
          height={220}
          width={width}
          play={playing}
          videoId={'Yk3D_6-FMOY'} // ← 유튜브 영상 ID로 교체
          onChangeState={(state: any) => {
            if (state === 'ended') {
              setPlaying(false);
            }
          }}
          onError={(e: any) => console.log('youtube error:', e)}
        />
        <View style={{ padding: 20 }}>
          <View style={{ alignItems: 'flex-start' }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 5,
                borderRadius: 4,
                backgroundColor: colors.gray0,
              }}
            >
              <CommonText
                labelText="미완료"
                labelTextStyle={[
                  fonts.semiBold,
                  { color: colors.gray6, fontSize: 14 },
                ]}
              />
            </View>
          </View>
          <CommonText
            labelText="[생명보험] 연금세일즈"
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 20, marginVertical: 15 },
            ]}
          />
          <CommonText
            labelText={
              '2026년 3월 ㅁㅁ화재보험 상품역량강화교육 영상입니다. \n영업 활동에 많은 활용 부탁드립니다.\n\n[교육내용]\nㅁㅁ화재 플래티넘 건강 리셋 월렛(00억 통장)\n- 상세 내용이 보여집니다.\n- 상세 내용이 보여집니다.\n\nㅁㅁ화재 플러스 치매보험\n(표적치매 치료)\n- 상세 내용이 보여집니다.\n- 상세 내용이 보여집니다.'
            }
            labelTextStyle={[
              { fontSize: 15, color: colors.gray8, lineHeight: 20 },
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
            labelText="교육완료"
            labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
