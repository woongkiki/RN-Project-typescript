import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { BarChart, RadarChart } from 'react-native-gifted-charts';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { BASE_URL } from '../../api/util';
import { getStatSummary } from '../../api/evaluation';
import { StatSummary } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'StatScreen'>;

const GRAY  = colors.gray2;
const BLUE  = colors.primary;
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const THIS_YEAR  = new Date().getFullYear();
const YEAR_RANGE = Array.from({ length: 5 }, (_, i) => THIS_YEAR - 4 + i); // 5년치

export default function StatScreen({ navigation }: Props) {
  const { width } = useAppDimensions();

  const today = new Date();
  const [statDate, setStatDate]         = useState(today);
  const [pickerVisible, setPickerVisible] = useState(false);
  // 피커 내부 임시 선택값
  const [pickerYear,  setPickerYear]    = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth]   = useState(today.getMonth() + 1);

  const [data, setData]           = useState<StatSummary | null>(null);
  const [loading, setLoading]     = useState(true);
  const [showScores, setShowScores] = useState(false);

  const load = (date: Date) => {
    setLoading(true);
    setShowScores(false);
    getStatSummary(date.getFullYear(), date.getMonth() + 1)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(statDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatStatDate = (date: Date) =>
    `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

  // 피커 열기 — 현재 선택값으로 초기화
  const openPicker = () => {
    setPickerYear(statDate.getFullYear());
    setPickerMonth(statDate.getMonth() + 1);
    setPickerVisible(true);
  };

  // 피커 확인
  const confirmPicker = () => {
    const next = new Date(pickerYear, pickerMonth - 1, 1);
    setStatDate(next);
    setPickerVisible(false);
    load(next);
  };

  // 미래 월 선택 방지
  const isDisabled = (y: number, m: number) =>
    y > today.getFullYear() ||
    (y === today.getFullYear() && m > today.getMonth() + 1);

  // ── 바차트 ──────────────────────────────────────────────────────────────────
  const barData = (data?.monthlyStats ?? []).flatMap(s => [
    { value: s.groupAverage, frontColor: GRAY, spacing: 0, label: `${s.month}월` },
    { value: s.myScore,      frontColor: BLUE, spacing: 20 },
  ]);

  // ── 레이더차트 ──────────────────────────────────────────────────────────────
  const categoryStats    = data?.categoryStats ?? [];
  const radarLabels      = categoryStats.map(c => c.categoryName);
  const radarMyScores    = categoryStats.map(c => c.myScore);
  const radarGroupScores = categoryStats.map(c => c.groupAverage);
  const radarDataLabels  = categoryStats.map(c =>
    String(c.rawMyScore !== undefined ? c.rawMyScore : c.myScore),
  );
  const radarSize = width - 80;

  return (
    <Layout>
      <SubHeader
        headerLabel="통계 및 분석"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* 날짜 선택 버튼 */}
          <TouchableOpacity
            onPress={openPicker}
            style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
          >
            <CommonText
              labelText={formatStatDate(statDate)}
              labelTextStyle={[fonts.medium, { fontSize: 15, color: colors.gray7 }]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
              style={{ width: 12, height: 7, resizeMode: 'contain' }}
            />
          </TouchableOpacity>

          {/* 설계사 평가 헤더 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 }}>
            <CommonText
              labelText="설계사 평가"
              labelTextStyle={[fonts.semiBold, { fontSize: 24, color: colors.gray10 }]}
            />
            {data?.evaluation?.grade && (
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.primary3, borderRadius: 6 }}>
                <CommonText
                  labelText={`${data.evaluation.grade}등급`}
                  labelTextStyle={[fonts.semiBold, { fontSize: 14, color: colors.primary }]}
                />
              </View>
            )}
          </View>

          {/* 범례 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray0, borderRadius: 8, marginBottom: 20 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: (width - 41) / 2, height: 40, gap: 10 }}>
              <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.primary }} />
              <CommonText labelText="내 점수" labelTextStyle={[fonts.medium, { fontSize: 12, color: colors.gray10 }]} />
            </View>
            <View style={{ width: 1, height: 16, backgroundColor: colors.gray2 }} />
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: (width - 41) / 2, height: 40, gap: 10 }}>
              <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.gray4 }} />
              <CommonText labelText="속한 그룹 평균" labelTextStyle={[fonts.medium, { fontSize: 12, color: colors.gray10 }]} />
            </View>
          </View>

          {/* 바차트 */}
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <>
              <View style={{ paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.gray1 }}>
                <BarChart
                  data={barData}
                  adjustToWidth
                  parentWidth={width - 40}
                  labelWidth={32}
                  xAxisLabelTextStyle={{ fontSize: 12 }}
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#999' }}
                  noOfSections={5}
                  maxValue={100}
                  isAnimated
                  roundedTop
                />
              </View>

              {/* 레이더차트 + 코멘트 — 데이터 있을 때만 표시 */}
              {radarLabels.length > 0 && (
                <View style={{ paddingVertical: 25 }}>
                  <CommonText
                    labelText="비교분석"
                    labelTextStyle={[fonts.semiBold, { color: colors.gray8, fontSize: 15 }]}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setShowScores(v => !v)}
                    style={{ alignItems: 'center', marginTop: 10 }}
                  >
                    <RadarChart
                      dataSet={[radarMyScores, radarGroupScores]}
                      labels={radarLabels}
                      dataLabels={radarDataLabels}
                      maxValue={100}
                      noOfSections={4}
                      chartSize={radarSize}
                      labelsPositionOffset={20}
                      gridConfig={{ stroke: colors.gray1, strokeWidth: 1, fill: 'transparent', showGradient: false }}
                      polygonConfigArray={[
                        { stroke: colors.primary, strokeWidth: 2, fill: 'rgba(0,139,239,0.2)', opacity: 1 },
                        { stroke: '#CFD0D4',      strokeWidth: 2, fill: 'rgba(207,208,212,0.2)', opacity: 1 },
                      ]}
                      asterLinesConfig={{ stroke: '#E0E0E0', strokeWidth: 1 }}
                      labelConfig={{ fontSize: 13, fontWeight: 'bold', stroke: '#333' }}
                      dataLabelsConfig={{ fontSize: 13, stroke: colors.primary, fontWeight: 'bold' }}
                      isAnimated
                    />
                    <CommonText
                      labelText={showScores ? '▲ 점수 닫기' : '▼ 항목별 점수 보기'}
                      labelTextStyle={[fonts.medium, { fontSize: 12, color: colors.primary, marginTop: 8 }]}
                    />
                  </TouchableOpacity>

                  {showScores && (
                    <View style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray1 }}>
                      <View style={{ flexDirection: 'row', backgroundColor: colors.gray1, paddingVertical: 8, paddingHorizontal: 12 }}>
                        <CommonText labelText="항목"     labelTextStyle={[fonts.semiBold, { flex: 1, fontSize: 12, color: colors.gray7 }]} />
                        <CommonText labelText="내 점수"  labelTextStyle={[fonts.semiBold, { width: 70, fontSize: 12, color: colors.primary, textAlign: 'center' }]} />
                        <CommonText labelText="그룹 평균" labelTextStyle={[fonts.semiBold, { width: 70, fontSize: 12, color: colors.gray5, textAlign: 'center' }]} />
                      </View>
                      {categoryStats.map((c, i) => (
                        <View key={i} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: i % 2 === 0 ? '#fff' : colors.gray0, alignItems: 'center' }}>
                          <CommonText labelText={c.categoryName} labelTextStyle={[fonts.medium, { flex: 1, fontSize: 13, color: colors.gray10 }]} />
                          <CommonText
                            labelText={c.rawMyScore !== undefined ? `${c.rawMyScore}점` : `${c.myScore}%`}
                            labelTextStyle={[fonts.semiBold, { width: 70, fontSize: 13, color: colors.primary, textAlign: 'center' }]}
                          />
                          <CommonText labelText={`${c.groupAverage}%`} labelTextStyle={[fonts.medium, { width: 70, fontSize: 13, color: colors.gray5, textAlign: 'center' }]} />
                        </View>
                      ))}
                    </View>
                  )}

                  {data?.evaluation?.comment && (
                    <View style={{ padding: 15, borderRadius: 12, backgroundColor: colors.gray1, marginTop: 10 }}>
                      <CommonText
                        labelText={data.evaluation.comment}
                        labelTextStyle={[{ fontSize: 14, color: colors.gray10, lineHeight: 20 }]}
                      />
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* ── 연/월 피커 모달 ─────────────────────────────────────────────────── */}
      <Modal transparent animationType="fade" visible={pickerVisible} onRequestClose={() => setPickerVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setPickerVisible(false)} />
        <View style={styles.sheet}>
          {/* 연도 선택 */}
          <View style={styles.yearRow}>
            {YEAR_RANGE.map(y => (
              <TouchableOpacity
                key={y}
                onPress={() => setPickerYear(y)}
                style={[styles.yearBtn, pickerYear === y && styles.yearBtnActive]}
              >
                <CommonText
                  labelText={`${y}`}
                  labelTextStyle={[
                    fonts.medium,
                    { fontSize: 14, color: pickerYear === y ? '#fff' : colors.gray7 },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* 월 선택 */}
          <View style={styles.monthGrid}>
            {MONTHS.map((label, idx) => {
              const m = idx + 1;
              const disabled = isDisabled(pickerYear, m);
              const selected = pickerMonth === m;
              return (
                <TouchableOpacity
                  key={m}
                  disabled={disabled}
                  onPress={() => setPickerMonth(m)}
                  style={[
                    styles.monthBtn,
                    selected  && styles.monthBtnActive,
                    disabled  && styles.monthBtnDisabled,
                  ]}
                >
                  <CommonText
                    labelText={label}
                    labelTextStyle={[
                      fonts.medium,
                      {
                        fontSize: 14,
                        color: disabled ? colors.gray3 : selected ? '#fff' : colors.gray8,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 확인 버튼 */}
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmPicker}>
            <CommonText
              labelText="확인"
              labelTextStyle={[fonts.semiBold, { fontSize: 15, color: '#fff' }]}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  yearBtn: {
    flex: 1,
    marginHorizontal: 3,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.gray0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearBtnActive: {
    backgroundColor: colors.primary,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  monthBtn: {
    width: '22%',
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.gray0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBtnActive: {
    backgroundColor: colors.primary,
  },
  monthBtnDisabled: {
    opacity: 0.4,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
