import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { AudioTtsItem } from '../types';
import { BASE_URL } from '../api/util';

interface Props {
  url: string;
  title?: string;
  ttsItems?: AudioTtsItem[];
  onPositionChange?: (position: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

let setupPlayerPromise: Promise<void> | null = null;
const setupPlayer = (): Promise<void> => {
  if (setupPlayerPromise) return setupPlayerPromise;
  setupPlayerPromise = (async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch {}
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
      ],
    });
  })();
  return setupPlayerPromise;
};

export default function AudioPlayer({
  url,
  title = '상담 녹취',
  ttsItems,
  onPositionChange,
}: Props) {
  const insets = useSafeAreaInsets();
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(200);
  const durationRef = useRef(0);

  const isPlaying = playbackState.state === State.Playing;
  const isLoading =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading ||
    playbackState.state === undefined;

  const [trackLoaded, setTrackLoaded] = useState(false);
  const [, setHasEnded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  // 프로그레스바 드래그
  const barWidthRef = useRef(0);
  const isDragging = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeightsRef = useRef<number[]>([]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async () => {
    await TrackPlayer.pause();
    await TrackPlayer.seekTo(0);
    setHasEnded(true);
    setActiveIdx(-1);
  });

  // position 변경 → 자막 인덱스 갱신
  useEffect(() => {
    if (isDragging.current) return;
    onPositionChange?.(position);
    if (ttsItems && ttsItems.length > 0) {
      const idx = ttsItems.findIndex(
        item => position >= item.startTime && position < item.endTime,
      );
      if (idx !== activeIdx) {
        setActiveIdx(idx);
        if (idx >= 0 && scrollViewRef.current) {
          const offsetY = itemHeightsRef.current
            .slice(0, idx)
            .reduce((sum, h) => sum + h, 0);
          scrollViewRef.current.scrollTo({ y: offsetY, animated: true });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    const init = async () => {
      await setupPlayer();
      await TrackPlayer.reset();
      await TrackPlayer.add({ url, title, artist: '상담 녹취' });
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      setTrackLoaded(true);
    };
    init();
    return () => {
      TrackPlayer.reset();
      setTrackLoaded(false);
    };
  }, [url]);

  const togglePlayback = async () => {
    if (!trackLoaded) return;
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      setHasEnded(false);
      await TrackPlayer.play();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        isDragging.current = true;
        setIsDraggingState(true);
        setDragPosition(
          Math.max(
            0,
            Math.min(1, evt.nativeEvent.locationX / barWidthRef.current),
          ),
        );
      },
      onPanResponderMove: evt => {
        setDragPosition(
          Math.max(
            0,
            Math.min(1, evt.nativeEvent.locationX / barWidthRef.current),
          ),
        );
      },
      onPanResponderRelease: async evt => {
        const ratio = Math.max(
          0,
          Math.min(1, evt.nativeEvent.locationX / barWidthRef.current),
        );
        await TrackPlayer.seekTo(ratio * durationRef.current);
        isDragging.current = false;
        setIsDraggingState(false);
      },
    }),
  ).current;

  const onBarLayout = (e: LayoutChangeEvent) => {
    barWidthRef.current = e.nativeEvent.layout.width;
  };

  const progressRatio = isDraggingState
    ? dragPosition
    : duration > 0
    ? position / duration
    : 0;

  const displayPosition = isDraggingState
    ? dragPosition * durationRef.current
    : position;

  return (
    <>
      {/* ── 컴팩트 트리거 ── */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
        style={styles.trigger}
      >
        <View style={styles.triggerLeft}>
          <View style={styles.triggerIcon}>
            {/* <CommonText
              labelText={isPlaying ? '⏸' : '▶'}
              labelTextStyle={{ fontSize: 14, color: colors.primary }}
            /> */}
            <Image
              source={{ uri: BASE_URL + '/images/music_icons.png' }}
              style={{ width: 18, height: 18, resizeMode: 'contain' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CommonText
              labelText={title}
              labelTextStyle={[
                fonts.medium,
                { fontSize: 13, color: colors.gray9 },
              ]}
              numberOfLines={1}
            />
            <CommonText
              labelText={
                isPlaying ? `${formatTime(position)} 재생 중` : '탭하여 재생'
              }
              labelTextStyle={{
                fontSize: 11,
                color: colors.gray5,
                marginTop: 2,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* ── 모달 플레이어 ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          {/* 딤 배경 */}
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          {/* 바텀시트 */}
          <View
            style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}
          >
            {/* 핸들 */}
            <View style={styles.handle} />

            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <CommonText
                labelText={title}
                labelTextStyle={[
                  fonts.semiBold,
                  { fontSize: 16, color: colors.gray10 },
                ]}
                numberOfLines={1}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CommonText
                  labelText="✕"
                  labelTextStyle={{ fontSize: 18, color: colors.gray6 }}
                />
              </TouchableOpacity>
            </View>

            {/* 프로그레스바 */}
            <View
              style={styles.progressWrap}
              onLayout={onBarLayout}
              {...panResponder.panHandlers}
            >
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressRatio * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.progressHandle,
                    { left: `${progressRatio * 100}%` },
                  ]}
                />
              </View>
            </View>

            {/* 시간 */}
            <View style={styles.timeRow}>
              <CommonText
                labelText={formatTime(displayPosition)}
                labelTextStyle={styles.timeText}
              />
              <CommonText
                labelText={formatTime(duration)}
                labelTextStyle={[styles.timeText, { color: colors.gray5 }]}
              />
            </View>

            {/* 재생/정지 버튼 */}
            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <TouchableOpacity
                onPress={togglePlayback}
                disabled={isLoading}
                style={styles.bigPlayBtn}
              >
                {/* <CommonText
                  labelText={isLoading ? '...' : isPlaying ? '⏸' : '▶'}
                  labelTextStyle={[
                    fonts.bold,
                    { fontSize: isLoading ? 18 : 28, color: colors.white },
                  ]}
                /> */}
                <Image
                  source={{
                    uri: isPlaying
                      ? BASE_URL + '/images/music_pause.png'
                      : BASE_URL + '/images/music_play.png',
                  }}
                  style={{
                    width: 18,
                    height: 24,
                    resizeMode: 'contain',
                    position: 'relative',
                    left: !isPlaying ? 1 : 0,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* 자막 리스트 */}
            {ttsItems && ttsItems.length > 0 && (
              <ScrollView
                ref={scrollViewRef}
                style={styles.ttsList}
                showsVerticalScrollIndicator={false}
              >
                {ttsItems.map((item, index) => {
                  const isActive = index === activeIdx;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => TrackPlayer.seekTo(item.startTime)}
                      onLayout={e => {
                        itemHeightsRef.current[index] =
                          e.nativeEvent.layout.height;
                      }}
                      style={[styles.ttsItem, isActive && styles.ttsItemActive]}
                    >
                      <CommonText
                        labelText={item.transcript}
                        labelTextStyle={[
                          styles.ttsText,
                          isActive && styles.ttsTextActive,
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // 컴팩트 트리거
  trigger: {
    backgroundColor: colors.gray1,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  triggerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // 모달
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  // 프로그레스바
  progressWrap: {
    height: 24,
    justifyContent: 'center',
  },
  progressBg: {
    height: 4,
    backgroundColor: colors.gray3,
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressHandle: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: -8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.gray7,
    ...fonts.medium,
  },

  // 큰 재생 버튼
  bigPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // 자막 리스트
  ttsList: {
    flexGrow: 0,
  },
  ttsItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  ttsItemActive: {
    backgroundColor: colors.primary3,
  },
  ttsText: {
    fontSize: 14,
    color: colors.gray6,
    lineHeight: 22,
    ...fonts.regular,
  },
  ttsTextActive: {
    color: colors.primary,
    ...fonts.semiBold,
  },
});
