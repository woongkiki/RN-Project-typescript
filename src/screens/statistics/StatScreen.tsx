import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { BarChart, RadarChart } from 'react-native-gifted-charts';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { BASE_URL } from '../../api/util';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getStatSummary } from '../../api/evaluation';
import { StatSummary } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'StatScreen'>;

const GRAY = colors.gray2;
const BLUE = colors.primary;

export default function StatScreen({ navigation }: Props) {
  const { width } = useAppDimensions();

  const today = new Date();
  const [statDate, setStatDate] = useState(today);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [data, setData] = useState<StatSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = (date: Date) => {
    setLoading(true);
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

  // 바차트 데이터 — 연도 전체 월별 (선택 월 이전까지)
  const barData = (data?.monthlyStats ?? [])
    .filter(s => s.month <= (statDate.getMonth() + 1))
    .flatMap(s => [
      {
        value: s.groupAverage,
        frontColor: GRAY,
        spacing: 0,
        label: `${s.month}월`,
      },
      { value: s.myScore, frontColor: BLUE, spacing: 20 },
    ]);

  // 레이더차트 데이터
  const radarLabels = (data?.categoryStats ?? []).map(c => c.categoryName);
  const radarMyScores = (data?.categoryStats ?? []).map(c => c.myScore);
  const radarGroupScores = (data?.categoryStats ?? []).map(c => c.groupAverage);

  return (
    <Layout>
      <SubHeader
        headerLabel="통계 및 분석"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* 날짜 선택 */}
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
          >
            <CommonText
              labelText={formatStatDate(statDate)}
              labelTextStyle={[
                fonts.medium,
                { fontSize: 15, color: colors.gray7 },
              ]}
            />
            <Image
              source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
              style={{ width: 12, height: 7, resizeMode: 'contain' }}
            />
          </TouchableOpacity>

          {/* 설계사 평가 헤더 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginVertical: 20,
            }}
          >
            <CommonText
              labelText="설계사 평가"
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 24, color: colors.gray10 },
              ]}
            />
            {data?.evaluation?.grade && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: colors.primary3,
                  borderRadius: 6,
                }}
              >
                <CommonText
                  labelText={`${data.evaluation.grade}등급`}
                  labelTextStyle={[
                    fonts.semiBold,
                    { fontSize: 14, color: colors.primary },
                  ]}
                />
              </View>
            )}
          </View>

          {/* 범례 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.gray0,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                width: (width - 41) / 2,
                height: 40,
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  backgroundColor: colors.primary,
                }}
              />
              <CommonText
                labelText="내 점수"
                labelTextStyle={[
                  fonts.medium,
                  { fontSize: 12, color: colors.gray10 },
                ]}
              />
            </View>
            <View
              style={{ width: 1, height: 16, backgroundColor: colors.gray2 }}
            />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                width: (width - 41) / 2,
                height: 40,
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  backgroundColor: colors.gray4,
                }}
              />
              <CommonText
                labelText="속한 그룹 평균"
                labelTextStyle={[
                  fonts.medium,
                  { fontSize: 12, color: colors.gray10 },
                ]}
              />
            </View>
          </View>

          {/* 바차트 */}
          {loading ? (
            <ActivityIndicator
              color={colors.primary}
              style={{ marginVertical: 40 }}
            />
          ) : (
            <>
              <View
                style={{
                  paddingBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray1,
                }}
              >
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

              {/* 레이더차트 + 코멘트 */}
              <View style={{ paddingVertical: 25 }}>
                <CommonText
                  labelText="비교분석"
                  labelTextStyle={[
                    fonts.semiBold,
                    { color: colors.gray8, fontSize: 15 },
                  ]}
                />
                {radarLabels.length > 0 && (
                  <RadarChart
                    dataSet={[radarMyScores, radarGroupScores]}
                    labels={radarLabels}
                    dataLabels={radarMyScores.map(String)}
                    maxValue={100}
                    noOfSections={4}
                    chartSize={width - 40}
                    labelsPositionOffset={15}
                    gridConfig={{
                      stroke: colors.gray1,
                      strokeWidth: 1,
                      fill: 'transparent',
                      showGradient: false,
                    }}
                    polygonConfigArray={[
                      {
                        stroke: colors.primary,
                        strokeWidth: 2,
                        fill: 'rgba(0, 139, 239, 0.2)',
                        opacity: 1,
                      },
                      {
                        stroke: '#CFD0D4',
                        strokeWidth: 2,
                        fill: 'rgba(207, 208, 212, 0.2)',
                        opacity: 1,
                      },
                    ]}
                    asterLinesConfig={{
                      stroke: '#E0E0E0',
                      strokeWidth: 1,
                    }}
                    labelConfig={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      stroke: '#333',
                    }}
                    dataLabelsConfig={{
                      fontSize: 13,
                      stroke: '#2196F3',
                    }}
                    isAnimated
                  />
                )}
                {data?.evaluation?.comment && (
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 12,
                      backgroundColor: colors.gray1,
                      marginTop: 10,
                    }}
                  >
                    <CommonText
                      labelText={data.evaluation.comment}
                      labelTextStyle={[
                        { fontSize: 14, color: colors.gray10, lineHeight: 20 },
                      ]}
                    />
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        locale="ko_KR"
        display="spinner"
        date={statDate}
        maximumDate={today}
        onConfirm={date => {
          setStatDate(date);
          setDatePickerVisible(false);
          load(date);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </Layout>
  );
}
