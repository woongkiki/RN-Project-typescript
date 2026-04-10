import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { fonts } from '../../constants/fonts';
import ProgressBox from '../../components/ProgressBox';
import BusinessCountButton from '../../components/BusinessCountButton';
import DbButton from '../../components/DbButton';
import Bar from '../../components/Bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../api/util';
import { getProgressCounts, getStatusHistory } from '../../api/customer';
import { ProgressCounts, StatusHistoryItem } from '../../types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function DBScreen() {
  const { width } = useAppDimensions();

  const navigation = useNavigation<NavigationProp>();

  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orderBy, setOrderBy] = useState(true); // true = desc

  const [progressCounts, setProgressCounts] = useState<ProgressCounts>({
    total: 0,
    meeting: 0,
    call: 0,
    absent: 0,
  });
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);

  const loadData = () => {
    getProgressCounts().then(setProgressCounts);
    getStatusHistory(20, orderBy).then(setStatusHistory);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getStatusHistory(20, orderBy).then(setStatusHistory);
  }, [orderBy]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setCurrentDate(new Date());
    loadData();
    setTimeout(() => setRefreshing(false), 1500);
  };

  //가망 고객 리스트 확인
  const possibleMove = () => {
    navigation.navigate('PossibleList');
  };

  //진행 중인 업무 확인
  const progressMove = () => {
    navigation.navigate('ProgressList', { cate: '' });
  };

  //전체 고객 리스트 확인
  const allClentMove = () => {
    navigation.navigate('AllList');
  };

  return (
    <Layout
      edges={['top']}
      scrollable={true}
      headerChildren={
        <MainHeader
          headerLabel={'DB 리스트'}
          headerRightContent={
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationScreen')}
              style={{
                width: 48,
                height: 48,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: BASE_URL + '/images/hd_bell.png' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: colors.mainRed,
                  position: 'absolute',
                  top: 12,
                  right: 0,
                }}
              ></View>
            </TouchableOpacity>
          }
        />
      }
    >
      <View style={[styles.box1]}>
        <View style={[styles.dbListWrap]}>
          <View style={[styles.row, {}]}>
            <View style={[styles.row, { gap: 6, width: width - 110 }]}>
              <Image
                source={{ uri: BASE_URL + '/images/calendar_blue.png' }}
                style={{ width: 18, height: 18, resizeMode: 'contain' }}
              />
              <CommonText
                labelText={formatDate(currentDate)}
                style={[fonts.semiBold, { color: colors.gray10, fontSize: 18 }]}
              />
            </View>
            <TouchableOpacity
              onPress={handleRefresh}
              disabled={refreshing}
              style={[
                {
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(238, 241, 245, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  alignItems: 'center',
                  justifyContent: 'center',

                  // iOS 그림자
                  shadowColor: '#AEBBC4', // rgba → hex 변환
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 3,

                  // Android 그림자
                  elevation: 4,
                  opacity: refreshing ? 0.4 : 1,
                },
              ]}
            >
              <Image
                source={{ uri: BASE_URL + '/images/refresh_gray.png' }}
                style={{ width: 12, height: 12, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', marginTop: 20 },
            ]}
          >
            <ProgressBox
              value={
                progressCounts.meeting +
                progressCounts.call +
                progressCounts.absent
              }
              total={progressCounts.total}
              label={'DB 진행률'}
            />
            <ProgressBox
              value={progressCounts.meeting}
              total={progressCounts.total}
              label={'미팅 진행률'}
            />
          </View>
        </View>
      </View>
      {/* 업무 컨텐츠 */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray1,
          }}
        >
          <CommonText
            labelText="현재 진행 중인 업무"
            labelTextStyle={[
              fonts.medium,
              { color: colors.gray8, fontSize: 15 },
            ]}
          />
          <View
            style={[
              styles.row,
              {
                width: width - 40,
                paddingVertical: 20,
                backgroundColor: colors.gray1,
                borderRadius: 12,
                marginTop: 20,
              },
            ]}
          >
            <BusinessCountButton
              label="미팅"
              count={String(progressCounts.meeting)}
              onPress={() =>
                navigation.navigate('ProgressList', { cate: '미팅완료' })
              }
            />
            <View
              style={{
                width: 1,
                height: '100%',
                backgroundColor: colors.gray2,
              }}
            />
            <BusinessCountButton
              label="통화"
              count={String(progressCounts.call)}
              onPress={() =>
                navigation.navigate('ProgressList', { cate: '통화' })
              }
            />
            <View
              style={{
                width: 1,
                height: '100%',
                backgroundColor: colors.gray2,
              }}
            />
            <BusinessCountButton
              label="부재"
              count={String(progressCounts.absent)}
              onPress={() =>
                navigation.navigate('ProgressList', { cate: '부재' })
              }
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => possibleMove()}
            style={[
              styles.boxShadow,
              {
                paddingHorizontal: 15,
                height: 56,
                backgroundColor: colors.primary,
                borderRadius: 12,
                justifyContent: 'center',
              },
            ]}
          >
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <View style={[styles.row, { gap: 10, width: width - 90 }]}>
                <Image
                  source={{ uri: BASE_URL + '/images/dart_icon.png' }}
                  style={{ width: 18, height: 18, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText="가망 고객 리스트"
                  labelTextStyle={[
                    fonts.semiBold,
                    { color: colors.white, fontSize: 16 },
                  ]}
                />
              </View>
              <Image
                source={{ uri: BASE_URL + '/images/white_arr.png' }}
                style={{ width: 10, height: 10, resizeMode: 'contain' }}
              />
            </View>
          </TouchableOpacity>
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', marginTop: 17 },
            ]}
          >
            <DbButton
              label="진행 중인 업무"
              onPress={progressMove}
              iconUri={BASE_URL + '/images/db_progress_icon.png'}
              iconWidth={20}
              iconHeight={20}
              iconWrapStyle={{
                backgroundColor: colors.subGreen,
              }}
            />
            <DbButton
              label="전체 고객 리스트"
              onPress={allClentMove}
              iconUri={BASE_URL + '/images/db_all_icon.png'}
              iconWrapStyle={{
                backgroundColor: colors.subPurple,
              }}
            />
          </View>
        </View>
      </View>
      <Bar />
      <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <CommonText
            labelText="변경 이력"
            labelTextStyle={[
              fonts.medium,
              { color: colors.gray8, fontSize: 15 },
            ]}
          />
          <TouchableOpacity
            onPress={() => setOrderBy(!orderBy)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          >
            <CommonText
              labelText="최신순"
              labelTextStyle={[
                fonts.medium,
                { color: colors.gray9, fontSize: 12 },
              ]}
            />
            {/* up_tri_arr */}
            <Image
              source={{
                uri: orderBy
                  ? BASE_URL + '/images/down_tri_arr.png'
                  : BASE_URL + '/images/up_tri_arr.png',
              }}
              style={{ width: 10, height: 6, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={[styles.row, styles.thead]}>
            <View style={[styles.th, { width: (width - 40) / 4 }]}>
              <CommonText labelText="고객명" style={[styles.thText]} />
            </View>
            <View style={[styles.th, { width: ((width - 40) / 4) * 2 }]}>
              <CommonText labelText="변경이력" style={[styles.thText]} />
            </View>
            <View style={[styles.th, { width: (width - 40) / 4 }]}>
              <CommonText labelText="변경일자" style={[styles.thText]} />
            </View>
          </View>
          {statusHistory.map(item => (
            <View key={item.idx} style={[styles.row, styles.tbody]}>
              <View style={[styles.td, { width: (width - 40) / 4 }]}>
                <CommonText
                  labelText={item.customerName}
                  style={[styles.tdText]}
                  numberOfLines={1}
                />
              </View>
              <View
                style={[
                  styles.td,
                  styles.row,
                  { gap: 6, width: ((width - 40) / 4) * 2 },
                ]}
              >
                <CommonText
                  labelText={item.prevStatus}
                  style={[
                    styles.tdText,
                    fonts.regular,
                    { color: colors.gray6 },
                  ]}
                  numberOfLines={1}
                />
                <Image
                  source={{ uri: BASE_URL + '/images/history_arr.png' }}
                  style={{ width: 5, height: 6, resizeMode: 'contain' }}
                />
                <CommonText
                  labelText={item.nextStatus}
                  style={[styles.tdText]}
                  numberOfLines={1}
                />
              </View>
              <View style={[styles.td, { width: (width - 40) / 4 }]}>
                <CommonText
                  labelText={item.changedAt.slice(2, 10).replace(/-/g, '.')}
                  style={[
                    styles.tdText,
                    fonts.regular,
                    { color: colors.gray6 },
                  ]}
                />
              </View>
            </View>
          ))}
          {statusHistory.length === 0 && (
            <View
              style={[
                styles.row,
                styles.tbody,
                { justifyContent: 'center', paddingVertical: 20 },
              ]}
            >
              <CommonText
                labelText="변경 이력이 없습니다."
                style={[styles.tdText, fonts.regular, { color: colors.gray6 }]}
              />
            </View>
          )}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
  box1: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dbListWrap: {
    backgroundColor: colors.gray1,
    borderRadius: 12,
    padding: 20,
    // elevation: 3, // 추가 시 backgroundColor 있으므로 정상 동작
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessText1: {
    fontSize: 14,
    color: colors.gray8,
  },
  businessText2: {
    ...fonts.semiBold,
    fontSize: 20,
    color: colors.gray9,
  },
  boxShadow: {
    // iOS 그림자
    shadowColor:
      Platform.OS == 'android' ? '#AFB0B4' : 'rgba(175, 176, 180, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8,
    shadowRadius: 8,

    // Android 그림자
    elevation: 2,
    backgroundColor: colors.white,
  },
  thead: {
    backgroundColor: colors.gray1,
    borderTopWidth: 1,
    borderTopColor: colors.gray3,
  },
  th: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thText: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.gray8,
  },
  tbody: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  td: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tdText: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.gray10,
  },
});
