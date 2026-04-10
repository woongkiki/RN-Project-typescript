import { CustomerType, Office, User } from '../types';

export type RootStackParamList = {
  AuthScreen: undefined;
  Main: undefined;
  FirstLogin: {
    user: User;
    token: string;
    office: Office;
  };
};

export type MainStackParamList = {
  TabNavigator: { screen: string };
  ProductDetail: { productId: string };
  MenuSetting: undefined;
  PossibleList: undefined;
  ProgressList: { cate: string };
  AllList: undefined;
  CustomerInfo: { idx: string; customerType: CustomerType };
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
};

export type MainTabParamList = {
  Home: undefined;
  Tab1: undefined;
  Schedule: undefined;
  Tab2: undefined;
  MyPage: undefined;
};
