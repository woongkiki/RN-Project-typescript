import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SubHeader from '../../components/SubHeader';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import CommonInput from '../../components/CommonInput';
import CommonText from '../../components/CommonText';
import { useAuthStore } from '../../store';
import { UserRole } from '../../types';
import { updateMyInfoApi } from '../../api/auth';

type Props = NativeStackScreenProps<MainStackParamList, 'MyInfoUpdate'>;

const ROLE_LABELS: Record<UserRole, string> = {
  FP: '설계사',
  TL: '팀장',
  BM: '지점장',
  BA: '관리자',
};

export default function MyInfoUpdate({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const office = useAuthStore(state => state.office);
  const token = useAuthStore(state => state.token);
  const updateUser = useAuthStore(state => state.updateUser);

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [hp, setHp] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (password && password !== rePassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password && password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자리 이상이어야 합니다.');
      return;
    }

    setSaving(true);
    try {
      await updateMyInfoApi({
        password: password || undefined,
        phone: hp || undefined,
        email: email || undefined,
      }, token ?? '');
      // 스토어 반영
      updateUser({ phone: hp || null, email: email || null });
      Alert.alert('알림', '저장되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('오류', '저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout scrollable={false}>
      <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* 이름 — 읽기 전용 */}
          <View>
            <CommonText labelText="이름" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={user?.name ?? ''}
              onChangeText={() => {}}
              inputStyle={[styles.inputStyle]}
              placeholder=""
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>

          {/* 아이디 — 읽기 전용 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="아이디(사번)" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={user?.loginId ?? ''}
              onChangeText={() => {}}
              inputStyle={[styles.inputStyle]}
              placeholder=""
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>

          {/* 비밀번호 변경 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="비밀번호" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={password}
              onChangeText={setPassword}
              inputStyle={[styles.inputStyle, { backgroundColor: colors.white }]}
              placeholder="변경하실 비밀번호를 입력하세요"
              placeholderTextColor={colors.gray6}
              secureTextEntry
            />
            <CommonInput
              value={rePassword}
              onChangeText={setRePassword}
              inputStyle={[styles.inputStyle, { backgroundColor: colors.white, marginTop: 10 }]}
              placeholder="비밀번호 확인"
              placeholderTextColor={colors.gray6}
              secureTextEntry
            />
          </View>

          {/* 소속 — 읽기 전용 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="소속" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={office?.name ?? ''}
              onChangeText={() => {}}
              inputStyle={[styles.inputStyle]}
              placeholder=""
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>

          {/* 자격 — 읽기 전용 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="자격" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={user?.role ? ROLE_LABELS[user.role] : ''}
              onChangeText={() => {}}
              inputStyle={[styles.inputStyle]}
              placeholder=""
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>

          {/* 연락처 — 수정 가능 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="연락처" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={hp}
              onChangeText={setHp}
              inputStyle={[styles.inputStyle, { backgroundColor: colors.white }]}
              placeholder="연락처를 입력해주세요"
              placeholderTextColor={colors.gray6}
              keyboardType="number-pad"
            />
          </View>

          {/* 이메일 — 수정 가능 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="이메일" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={email}
              onChangeText={setEmail}
              inputStyle={[styles.inputStyle, { backgroundColor: colors.white }]}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor={colors.gray6}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.gray1 }}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: saving ? colors.gray4 : colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonText
            labelText={saving ? '저장 중...' : '저장'}
            labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  boxMargin: {
    marginTop: 25,
  },
  labelStyle: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.gray9,
    marginBottom: 10,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: colors.gray3,
    height: 50,
    fontSize: 16,
  },
});
