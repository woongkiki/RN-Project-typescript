import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { getPlanMenus, MenuCode } from '../../api/plan';

type Props = NativeStackScreenProps<MainStackParamList, 'MenuSetting'>;

type MenuItem = {
  key: MenuCode;
  label: string;
  icon: string;
};

const MENU_STORAGE_KEY = 'menu-order';

const MENU_DEFS: Record<MenuCode, Omit<MenuItem, 'key'>> = {
  db:        { label: 'DB리스트',  icon: 'dblist_icon.png' },
  schedule:  { label: '스케줄',    icon: 'schedule_icon_b.png' },
  education: { label: '교육',      icon: 'edu_icon.png' },
  community: { label: '커뮤니티', icon: 'community_icon.png' },
  payment:   { label: '정산',      icon: 'adjust_icon.png' },
  stats:     { label: '통계/분석', icon: 'stat_icon.png' },
  seminar:   { label: '세미나',   icon: 'seminar_icon.png' },
};

export default function MenuSettingScreen({ navigation }: Props) {
  const { width } = useAppDimensions();
  const office = useAuthStore(state => state.office);
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!office) { return; }
    // planIdx 없는 기존 세션은 planCode로 fallback
    const planIdx = office.planIdx ?? (office.planCode === 'C' ? 3 : office.planCode === 'B' ? 2 : 1);

    getPlanMenus(planIdx).then(async allowedCodes => {
      // 저장된 순서 불러오기
      const saved = await AsyncStorage.getItem(MENU_STORAGE_KEY);
      const savedOrder: MenuCode[] = saved ? JSON.parse(saved) : [];

      // 저장된 순서 중 현재 플랜에서 허용된 코드만 유지
      const ordered = savedOrder.filter(code => allowedCodes.includes(code));
      // 저장 목록에 없는 신규 허용 코드는 뒤에 추가
      const newCodes = allowedCodes.filter(code => !ordered.includes(code));
      const finalCodes = [...ordered, ...newCodes];

      setMenus(finalCodes.map(code => ({ key: code, ...MENU_DEFS[code] })));
    });
  }, [office?.planIdx]);

  const handleSave = async () => {
    await AsyncStorage.setItem(
      MENU_STORAGE_KEY,
      JSON.stringify(menus.map(m => m.key)),
    );
    navigation.goBack();
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<MenuItem>) => (
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
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.bar} />
          ))}
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );

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
