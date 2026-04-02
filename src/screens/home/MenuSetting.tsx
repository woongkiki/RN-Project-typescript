import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import IconBox from '../../components/IconBox';
import { colors } from '../../constants/colors';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { BASE_URL } from '../../api/util';
import { useAuthStore } from '../../store';

type Props = NativeStackScreenProps<MainStackParamList, 'MenuSetting'>;

type MenuItem = {
  key: string;
  label: string;
  icon: string;
};

// C,D 등급
const INITIAL_MENUS: MenuItem[] = [
  { key: 'db', label: 'DB리스트', icon: 'dblist_icon.png' },
  {
    key: 'schedule',
    label: '스케줄',
    icon: 'schedule_icon_b.png',
  },
  {
    key: 'education',
    label: '교육',
    icon: 'edu_icon.png',
  },
  {
    key: 'community',
    label: '커뮤니티',
    icon: 'community_icon.png',
  },
  {
    key: 'payment',
    label: '정산',
    icon: 'adjust_icon.png',
  },
  {
    key: 'stats',
    label: '통계/분석',
    icon: 'stat_icon.png',
  },
  {
    key: 'seminar',
    label: '세미나',
    icon: 'seminar_icon.png',
  },
];

// A,B등급
const INITIAL_MENUS2: MenuItem[] = [
  { key: 'db', label: 'DB리스트', icon: 'dblist_icon.png' },
  {
    key: 'education',
    label: '교육',
    icon: 'edu_icon.png',
  },
  {
    key: 'community',
    label: '커뮤니티',
    icon: 'community_icon.png',
  },
  {
    key: 'payment',
    label: '정산',
    icon: 'adjust_icon.png',
  },

  {
    key: 'seminar',
    label: '세미나',
    icon: 'seminar_icon.png',
  },
];

export default function MenuSettingScreen({ navigation }: Props) {
  const { width } = useAppDimensions();

  const user = useAuthStore(state => state.user); // ← 변경
  const [menus, setMenus] = useState<MenuItem[]>(
    (user?.grade ?? 0) > 2 ? INITIAL_MENUS : INITIAL_MENUS2,
  );

  const handleSave = () => {
    // 저장 로직 (API 호출 등)
    console.log(
      '저장된 순서:',
      menus.map(m => m.key),
    );
    navigation.goBack();
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<MenuItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          activeOpacity={1}
          style={[styles.row, isActive && styles.rowActive]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 15,
              width: width - 96,
            }}
          >
            <IconBox
              iconWrapStyle={{ width: 46, height: 46 }}
              iconWidth={24}
              iconHeight={24}
              iconUri={BASE_URL + '/images/' + item.icon}
            />
            <CommonText labelText={item.label} labelTextStyle={styles.label} />
          </View>
          <View style={styles.dragHandle}>
            {/* 햄버거 아이콘 (≡) */}
            {[0, 1, 2].map(i => (
              <View key={i} style={styles.bar} />
            ))}
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Layout>
        <SubHeader
          headerLabel="메뉴설정"
          headerLeftOnPress={() => navigation.goBack()}
        />
        <DraggableFlatList
          data={menus}
          onDragEnd={({ data }) => setMenus(data)}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          containerStyle={{ flex: 1 }}
          ListHeaderComponent={
            <CommonText
              labelText="메뉴 순서를 변경할 수 있어요"
              labelTextStyle={styles.description}
            />
          }
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <CommonText labelText="저장" labelTextStyle={styles.saveText} />
        </TouchableOpacity>
      </Layout>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    ...fonts.bold,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  rowActive: {
    backgroundColor: '#f5f5f5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 15,
    ...fonts.medium,
    color: colors.gray9,
  },
  dragHandle: {
    gap: 4,
    width: 46,
    height: 46,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    width: 18,
    height: 2,
    backgroundColor: '#AEBBC4',
    borderRadius: 1.5,
  },
  saveButton: {
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: colors.gray5,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    color: '#fff',
    ...fonts.semiBold,
  },
});
