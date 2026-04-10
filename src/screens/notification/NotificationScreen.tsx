import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { BASE_URL } from '../../api/util';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { Notification, NotificationType } from '../../types';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notification';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: string; color: string; bg: string }
> = {
  schedule: {
    label: '스케줄',
    icon: '/images/calendar_black.png',
    color: colors.primary,
    bg: colors.primary3,
  },
  db: {
    label: 'DB',
    icon: '/images/db_icon_sm.png',
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
  community: {
    label: '커뮤니티',
    icon: '/images/community_icon_sm.png',
    color: '#10B981',
    bg: '#D1FAE5',
  },
  system: {
    label: '시스템',
    icon: '/images/bell_gray.png',
    color: colors.gray7,
    bg: colors.gray1,
  },
};

const formatDate = (createdAt: string) =>
  createdAt.slice(0, 16).replace('-', '.').replace('-', '.').replace(' ', ' ');

export default function NotificationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRead = (idx: number) => {
    markAsRead(idx);
    setNotifications(prev =>
      prev.map(n => (n.idx === idx ? { ...n, isRead: true } : n)),
    );
  };

  const handleReadAll = () => {
    markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: Notification;
    index: number;
  }) => {
    const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system;
    const isLast = index === notifications.length - 1;

    return (
      <TouchableOpacity
        onPress={() => handleRead(item.idx)}
        activeOpacity={0.7}
        style={[
          styles.item,
          !item.isRead && styles.itemUnread,
          !isLast && styles.itemBorder,
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
          <Image
            source={{ uri: BASE_URL + config.icon }}
            style={{ width: 16, height: 16, resizeMode: 'contain' }}
          />
        </View>

        <View style={{ flex: 1, gap: 5 }}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={[styles.row, { gap: 6 }]}>
              <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                <CommonText
                  labelText={config.label}
                  labelTextStyle={[
                    { fontSize: 11, color: config.color },
                    fonts.semiBold,
                  ]}
                />
              </View>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
            <CommonText
              labelText={formatDate(item.createdAt)}
              labelTextStyle={[{ fontSize: 11, color: colors.gray5 }]}
            />
          </View>
          <CommonText
            labelText={item.title}
            labelTextStyle={[
              fonts.semiBold,
              {
                fontSize: 15,
                color: item.isRead ? colors.gray7 : colors.gray10,
              },
            ]}
          />
          {item.message && (
            <CommonText
              labelText={item.message}
              labelTextStyle={[
                { fontSize: 13, color: colors.gray6, lineHeight: 18 },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <SubHeader
        headerLabel="알림"
        headerLeftOnPress={() => navigation.goBack()}
      />

      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
          },
        ]}
      >
        <CommonText
          labelText={
            unreadCount > 0
              ? `읽지 않은 알림 ${unreadCount}개`
              : '모든 알림을 읽었습니다'
          }
          labelTextStyle={[
            fonts.medium,
            {
              fontSize: 13,
              color: unreadCount > 0 ? colors.primary : colors.gray5,
            },
          ]}
        />
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleReadAll}>
            <CommonText
              labelText="모두 읽음"
              labelTextStyle={[
                fonts.medium,
                { fontSize: 13, color: colors.gray6 },
              ]}
            />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => String(item.idx)}
          renderItem={renderItem}
          style={{ flex: 1, backgroundColor: colors.white }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <CommonText
                labelText="알림이 없습니다."
                labelTextStyle={[{ fontSize: 15, color: colors.gray5 }]}
              />
            </View>
          }
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  itemUnread: {
    backgroundColor: '#F0F7FF',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
  },
});
