import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { loginApi } from '../../api/auth';
import { useAuthStore } from '../../store';
import Layout from '../../components/Layout';
import CommonInput from '../../components/CommonInput';
import CommonButton from '../../components/CommonButton';
import { BASE_URL } from '../../api/util';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthScreen'>;

export default function LoginScreen({ navigation }: Props) {
  const setAuth = useAuthStore(state => state.setAuth); // ← 변경
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [idSave, setIdSave] = useState(false);

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const { user, token, brandConfig, firstlogin } = await loginApi(
        id,
        password,
      );

      // console.log(id, firstlogin);

      if (firstlogin) {
        // 최초 로그인 → 비밀번호 변경 화면으로
        navigation.navigate('FirstLogin', { user, token, brandConfig });
      } else {
        // 일반 로그인 → 메인으로
        setAuth(user, token, brandConfig);
      }
    } catch (e) {
      Alert.alert('오류', '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      fixViewStyle={{
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ width: 172, height: 56, backgroundColor: '#f00' }}></View>
      <View style={{ width: '100%', gap: 15, marginTop: 60, marginBottom: 40 }}>
        <CommonInput value={id} onChangeText={setId} placeholder={'아이디'} />
        <CommonInput
          value={password}
          onChangeText={setPassword}
          placeholder={'비밀번호'}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => setIdSave(!idSave)}
          style={[{ flexDirection: 'row', alignItems: 'center', gap: 6 }]}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: idSave ? colors.primary : colors.gray3,
              backgroundColor: idSave ? colors.primary : colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {idSave && (
              <Image
                source={{ uri: BASE_URL + '/images/check_icon_white.png' }}
                style={{ width: 16, height: 7, resizeMode: 'contain' }}
              />
            )}
          </View>
          <CommonText
            labelText="아이디(사번) 저장"
            labelTextStyle={{ fontSize: 14, color: colors.gray9 }}
          />
        </TouchableOpacity>
      </View>
      <CommonButton
        label={'로그인'}
        onPress={handleLogin}
        disabled={loading}
        loading={loading}
      />
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginTop: 24,
        }}
      >
        <TouchableOpacity>
          <CommonText
            labelText="아이디 찾기"
            labelTextStyle={[styles.registerButtonText]}
          />
        </TouchableOpacity>
        <View style={[styles.bar]} />
        <TouchableOpacity>
          <CommonText
            labelText="비밀번호 찾기"
            labelTextStyle={[styles.registerButtonText]}
          />
        </TouchableOpacity>
        <View style={[styles.bar]} />

        <TouchableOpacity>
          <CommonText
            labelText="회원가입"
            labelTextStyle={[styles.registerButtonText]}
          />
        </TouchableOpacity>
      </View> */}
    </Layout>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  bar: { width: 1, height: 12, backgroundColor: colors.gray4 },
  registerButtonText: { fontSize: 16, color: colors.gray6 },
});
