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
import { completeEducationVideo, getEducationVideo } from '../../api/board';
import { EducationVideoItem } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'VideoDetailScreen'>;

export default function VideoDetailScreen({ route, navigation }: Props) {
  const { idx } = route.params;
  const { width } = useAppDimensions();

  const [video, setVideo] = useState<EducationVideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getEducationVideo(Number(idx))
      .then(data => {
        setVideo(data);
        setIsCompleted(data.isCompleted);
      })
      .catch(() => Alert.alert('오류', '영상을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [idx]);

  const handleComplete = () => {
    Alert.alert('교육 완료', '이 영상을 교육완료로 처리하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '완료',
        onPress: async () => {
          setActionLoading(true);
          try {
            await completeEducationVideo(Number(idx));
            setIsCompleted(true);
            Alert.alert('완료', '교육이 완료 처리되었습니다.');
          } catch (e: any) {
            Alert.alert('오류', e?.message ?? '처리에 실패했습니다.');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      return () => setPlayingIdx(null);
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
        {/* 영상 목록 */}
        {video?.videos.map((v, i) => (
          <View key={v.idx} style={{ marginBottom: i < (video.videos.length - 1) ? 12 : 0 }}>
            {video.videos.length > 1 && (
              <CommonText
                labelText={`영상 ${i + 1}`}
                labelTextStyle={[fonts.semiBold, { fontSize: 13, color: colors.gray7, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }]}
              />
            )}
            <YoutubePlayer
              height={220}
              width={width}
              play={playingIdx === i}
              videoId={v.youtubeId}
              onChangeState={(state: any) => {
                if (state === 'ended') setPlayingIdx(null);
                if (state === 'playing') setPlayingIdx(i);
              }}
              onError={(e: any) => console.log('youtube error:', e)}
            />
          </View>
        ))}

        <View style={{ padding: 20 }}>
          <View style={{ alignItems: 'flex-start' }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 5,
                borderRadius: 4,
                backgroundColor: isCompleted ? colors.primary3 : colors.gray0,
              }}
            >
              <CommonText
                labelText={isCompleted ? '교육완료' : '미완료'}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 14, color: isCompleted ? colors.primary : colors.gray6 },
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
          disabled={isCompleted || actionLoading}
          onPress={handleComplete}
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: isCompleted ? colors.gray3 : colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonText
            labelText={actionLoading ? '처리중...' : isCompleted ? '교육완료' : '완료하기'}
            labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
