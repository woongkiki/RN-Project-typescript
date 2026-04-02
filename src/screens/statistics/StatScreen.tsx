import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { BarChart, RadarChart } from 'react-native-gifted-charts';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { BASE_URL } from '../../api/util';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = NativeStackScreenProps<MainStackParamList, 'StatScreen'>;

const GRAY = colors.gray2;
const BLUE = colors.primary;

// 그룹당 [회색 막대, 파란 막대] 쌍으로 구성
// spacing: 0  → 같은 그룹 내 막대 간격 없음
// spacing: 20 → 다음 그룹과의 간격
const barData = [
  { value: 60, frontColor: GRAY, spacing: 0, label: '1월' },
  { value: 71, frontColor: BLUE, spacing: 20 },

  { value: 58, frontColor: GRAY, spacing: 0, label: '2월' },
  { value: 30, frontColor: BLUE, spacing: 20 },

  { value: 58, frontColor: GRAY, spacing: 0, label: '3월' },
  { value: 31, frontColor: BLUE, spacing: 20 },

  { value: 60, frontColor: GRAY, spacing: 0, label: '4월' },
  { value: 71, frontColor: BLUE, spacing: 20 },

  { value: 85, frontColor: GRAY, spacing: 0, label: '5월' },
  { value: 71, frontColor: BLUE, spacing: 20 },

  { value: 85, frontColor: GRAY, spacing: 0, label: '6월' },
  { value: 71, frontColor: BLUE, spacing: 20 },
];

export default function StatScreen({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [statDate, setStatDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const formatStatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    return `${y}년 ${m}월`;
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="통계 및 분석"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={[{ padding: 20 }]}>
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
          <CommonText
            labelText="설계사 평가"
            labelTextStyle={[
              fonts.semiBold,
              { fontSize: 24, color: colors.gray10, marginVertical: 20 },
            ]}
          />
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
          <View
            style={{
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
            }}
          >
            <BarChart
              data={barData}
              adjustToWidth // ← 자동 너비 맞춤
              parentWidth={width - 40} // ← padding 40 (양쪽 20씩)
              labelWidth={32} // 그룹당 라벨 너비
              xAxisLabelTextStyle={{ fontSize: 12 }} // 필요시 폰트 크기 조절
              xAxisThickness={1}
              yAxisThickness={0}
              yAxisTextStyle={{ color: '#999' }}
              noOfSections={5}
              maxValue={100}
              isAnimated
              roundedTop
            />
          </View>
          <View style={{ paddingVertical: 25 }}>
            <CommonText
              labelText="비교분석"
              labelTextStyle={[
                fonts.semiBold,
                { color: colors.gray8, fontSize: 15 },
              ]}
            />

            <RadarChart
              dataSet={[
                [70, 30, 50, 70, 70, 95], // 첫 번째 (파란색)
                [60, 55, 65, 60, 80, 85], // 두 번째 (회색)
              ]}
              labels={['title', 'title', 'title', 'title', 'title', 'title']}
              dataLabels={['70', '30', '50', '70', '70', '95']}
              maxValue={100}
              noOfSections={4}
              chartSize={width - 40}
              labelsPositionOffset={15}
              gridConfig={{
                stroke: colors.gray1,
                strokeWidth: 1,
                fill: 'transparent', // ← 회색 배경 제거
                showGradient: false, // ← 그라디언트 제거
              }}
              polygonConfigArray={[
                {
                  stroke: colors.primary, // 파란색 선
                  strokeWidth: 2,
                  fill: 'rgba(0, 139, 239, 0.2)', // 파란색 반투명
                  opacity: 1,
                },
                {
                  stroke: '#CFD0D4', // 회색 선
                  strokeWidth: 2,
                  fill: 'rgba(207, 208, 212, 0.2)', // 회색 반투명
                  opacity: 1,
                },
              ]}
              asterLinesConfig={{
                // gridConfig → asterLinesConfig
                stroke: '#E0E0E0',
                strokeWidth: 1,
              }}
              labelConfig={{
                fontSize: 14,
                fontWeight: 'bold',
                stroke: '#333', // color → stroke
              }}
              dataLabelsConfig={{
                fontSize: 13,
                stroke: '#2196F3', // color → stroke
              }}
              isAnimated
            />
            <View
              style={{
                padding: 15,
                borderRadius: 12,
                backgroundColor: colors.gray1,
              }}
            >
              <CommonText
                labelText={
                  '미팅률 65%는 평균 이상이며,\n계약 30%는 평균 수준입니다.\n\nDB 응답은 훌륭하지만, 가망 고객 케어에서 더 신경을\n쓴다면 좋은 결과가 있을 것으로 예상됩니다.'
                }
                labelTextStyle={[
                  { fontSize: 14, color: colors.gray10, lineHeight: 20 },
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        locale="ko_KR"
        display="spinner"
        date={statDate}
        maximumDate={new Date()}
        onConfirm={date => {
          setStatDate(date);
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </Layout>
  );
}
