import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Image, StyleSheet, View } from 'react-native';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { BASE_URL } from '../../api/util';
import CommonInput from '../../components/CommonInput';
import CommonButton from '../../components/CommonButton';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'FirstLogin'>;

export default function FirstLoginScreen({ route }: Props) {
  const { user, token, brandConfig } = route.params;
  const setAuth = useAuthStore(state => state.setAuth);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassowrd, setRePassword] = useState('');

  const handleConfirm = () => {
    // TODO: 비밀번호 변경 API 호출
    setAuth(user, token, brandConfig); // → RootNavigator가 MainNavigator로 전환
  };

  return (
    <Layout
      scrollable={true}
      footerChildren={
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <CommonButton
            label={'확인'}
            onPress={handleConfirm}
            disabled={loading}
            loading={loading}
          />
        </View>
      }
      fixViewStyle={{
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          padding: 20,
          paddingTop: 50,
        }}
      >
        <Image
          source={{ uri: BASE_URL + '/images/key_icon_sky.png' }}
          style={{ width: 32, height: 32, resizeMode: 'contain' }}
        />
        <CommonText
          labelText={'개인정보를 위해\n비밀번호를 변경해 주세요'}
          labelTextStyle={[
            fonts.semiBold,
            {
              fontSize: 24,
              color: colors.gray9,
              lineHeight: 30,
              marginTop: 24,
            },
          ]}
        />
        <View style={{ marginTop: 45 }}>
          <CommonText labelText="비밀번호" labelTextStyle={[styles.label]} />
          <CommonInput
            value={password}
            onChangeText={setPassword}
            placeholder={'영문, 숫자, 특수문자 8자리 이상'}
            secureTextEntry
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <CommonText
            labelText="비밀번호 확인"
            labelTextStyle={[styles.label]}
          />
          <CommonInput
            value={rePassowrd}
            onChangeText={setRePassword}
            placeholder={'비밀번호를 한번 더 입력해주세요.'}
            secureTextEntry
          />
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  label: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.gray9,
    marginBottom: 10,
  },
});
