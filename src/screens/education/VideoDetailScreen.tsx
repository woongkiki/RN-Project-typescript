import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getEducationVideo } from '../../api/board';
import { EducationVideoItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'VideoDetailScreen'>;

export default function VideoDetailScreen({ route, navigation }: Props) {
  const { idx } = route.params;
  const { width } = useAppDimensions();

  const [video, setVideo] = useState<EducationVideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    getEducationVideo(Number(idx))
      .then(setVideo)
      .catch(() => Alert.alert('오류', '영상을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [idx]);

  useFocusEffect(
    useCallback(() => {
      return () => setPlaying(false);
    }, []),
  );

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
        <YoutubePlayer
          height={220}
          width={width}
          play={playing}
          videoId={video?.youtubeId ?? ''}
          onChangeState={(state: any) => {
            if (state === 'ended') setPlaying(false);
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
                backgroundColor: video?.isCompleted ? colors.primary3 : colors.gray0,
              }}
            >
              <CommonText
                labelText={video?.isCompleted ? '교육완료' : '미완료'}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 14, color: video?.isCompleted ? colors.primary : colors.gray6 },
                ]}
              />
            </View>
          </View>
          <CommonText
            labelText={video?.title ?? ''}
            labelTextStyle={[fonts.semiBold, { fontSize: 20, marginVertical: 15 }]}
          />
          <CommonText
            labelText={video?.description ?? ''}
            labelTextStyle={[{ fontSize: 15, color: colors.gray8, lineHeight: 20 }]}
          />
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.gray1 }}>
        <TouchableOpacity
          style={{ height: 52, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
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
