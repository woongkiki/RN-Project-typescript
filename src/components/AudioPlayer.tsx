import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
  AppKilledPlaybackBehavior,
  RepeatMode,
} from 'react-native-track-player';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

interface Props {
  // 실제 서버 URL 또는 로컬 파일 경로
  url: string;
  title?: string;
  // 자막 싱크를 위한 콜백 (추후 자막 기능 추가 시 사용)
  onPositionChange?: (position: number) => void;
}

// 초 → mm:ss 포맷
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

let isPlayerSetup = false;

const setupPlayer = async () => {
  if (isPlayerSetup) return;
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    android: {
      // 앱 종료 시 재생 중단 (녹취 파일 특성상 종료 시 멈추는 게 자연스러움)
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
    // compactCapabilities: [Capability.Play, Capability.Pause],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
    ],
  });
  isPlayerSetup = true;
};

export default function AudioPlayer({
  url,
  title = '상담 녹취',
  onPositionChange,
}: Props) {
  const playbackState = usePlaybackState();
  // ✅ 200ms마다 position 업데이트 → 자막 싱크에 적합
  const { position, duration } = useProgress(200);

  const durationRef = useRef(0);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const isPlaying = playbackState.state === State.Playing;
  const isLoading =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading ||
    playbackState.state === undefined;

  const [trackLoaded, setTrackLoaded] = useState(false);
  // const [barWidth, setBarWidth] = useState(0);
  const barWidthRef = useRef(0);
  const isDragging = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false); // ✅ 추가
  const [dragPosition, setDragPosition] = useState(0);

  // ✅ position 변경 시 자막 콜백 호출
  useEffect(() => {
    if (onPositionChange && !isDragging.current) {
      onPositionChange(position);
    }
  }, [position]);

  // ✅ 컴포넌트 마운트 시 플레이어 초기화 + 트랙 로드
  useEffect(() => {
    const init = async () => {
      await setupPlayer();
      await TrackPlayer.reset();
      await TrackPlayer.add({
        url,
        title,
        artist: '상담 녹취',
      });
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      setTrackLoaded(true);
    };
    init();

    return () => {
      // ✅ 화면 벗어나면 정지 및 리셋
      TrackPlayer.reset();
      setTrackLoaded(false);
    };
  }, [url]);

  const togglePlayback = async () => {
    if (!trackLoaded) return;
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  // ✅ 프로그레스바 드래그로 seek
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        isDragging.current = true;
        setIsDraggingState(true);
        const ratio = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / barWidthRef.current),
        );
        setDragPosition(ratio);
      },
      onPanResponderMove: evt => {
        const ratio = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / barWidthRef.current),
        );
        setDragPosition(ratio);
      },
      onPanResponderRelease: async evt => {
        const ratio = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / barWidthRef.current),
        );
        // const seekTo = ratio * duration;
        const seekTo = ratio * durationRef.current;
        await TrackPlayer.seekTo(seekTo);
        isDragging.current = false;
        setIsDraggingState(false);
      },
    }),
  ).current;

  const onBarLayout = (e: LayoutChangeEvent) => {
    // setBarWidth(e.nativeEvent.layout.width);
    barWidthRef.current = e.nativeEvent.layout.width;
  };

  // 현재 표시할 progress ratio
  const progressRatio = isDraggingState // ✅
    ? dragPosition
    : duration > 0
    ? position / duration
    : 0;

  return (
    <View style={styles.container}>
      {/* 재생/정지 버튼 */}
      <TouchableOpacity
        onPress={togglePlayback}
        style={styles.playButton}
        disabled={isLoading}
      >
        <CommonText
          labelText={isLoading ? '...' : isPlaying ? '⏸' : '▶'}
          labelTextStyle={[
            fonts.bold,
            {
              fontSize: isLoading ? 14 : 20,
              color: isLoading ? colors.gray5 : colors.primary,
            },
          ]}
        />
      </TouchableOpacity>

      {/* 프로그레스바 + 시간 */}
      <View style={styles.rightArea}>
        {/* ✅ 드래그 가능한 프로그레스바 */}
        <View
          style={styles.progressBarWrap}
          onLayout={onBarLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressRatio * 100}%` },
              ]}
            />
            {/* 핸들 */}
            <View
              style={[
                styles.progressHandle,
                { left: `${progressRatio * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* 시간 표시 */}
        <View style={styles.timeRow}>
          <CommonText
            // labelText={formatTime(
            //   isDragging.current ? dragPosition * duration : position,
            // )}
            labelText={formatTime(
              isDraggingState // ✅
                ? dragPosition * durationRef.current
                : position,
            )}
            labelTextStyle={[styles.timeText]}
          />
          <CommonText
            labelText={formatTime(duration)}
            labelTextStyle={[styles.timeText, { color: colors.gray5 }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray0,
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rightArea: {
    flex: 1,
    gap: 6,
  },
  progressBarWrap: {
    height: 20,
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.gray3,
    borderRadius: 2,
    position: 'relative',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressHandle: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    marginLeft: -7,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: colors.gray7,
    ...fonts.medium,
  },
});
