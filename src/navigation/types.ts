import { BrandConfig, User } from '../types';

export type RootStackParamList = {
  AuthScreen: undefined;
  Main: undefined;
  FirstLogin: {
    user: User;
    token: string;
    brandConfig: BrandConfig;
  };
};

export type MainStackParamList = {
  TabNavigator: { screen: string };
  ProductDetail: { productId: string };
  MenuSetting: undefined;
  PossibleList: undefined;
  ProgressList: { cate: string };
  AllList: undefined;
  CustomerInfo: { idx: string };
  BoardList: undefined;
  FreeBoardList: undefined;
  BoardInfo: { idx: string };
  BoardForm: undefined;
  ScheduleForm: { idx: any; w: string };
  MyInfoUpdate: undefined;
  EducationScreen: { tab: string };
  VideoDetailScreen: { idx: any };
  SeminarScreen: undefined;
  SeminarInfo: { idx: any };
  Adjustment: undefined;
  StatScreen: undefined;
  NotificationScreen: undefined;
  // 추가 공통 화면은 여기에 계속 추가
};

export type MainTabParamList = {
  Home: undefined;
  Tab1: undefined;
  Schedule: undefined;
  Tab2: undefined;
  MyPage: undefined;
};
