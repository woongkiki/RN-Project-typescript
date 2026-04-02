import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SubHeader from '../../components/SubHeader';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import CommonInput from '../../components/CommonInput';
import CommonText from '../../components/CommonText';
import { useAuthStore } from '../../store';

type Props = NativeStackScreenProps<MainStackParamList, 'MyInfoUpdate'>;

export default function MyInfoUpdate({ navigation }: Props) {
  const user = useAuthStore(state => state.user); // ← 변경

  // console.log('user', user);

  const { width } = useAppDimensions();

  const [name, setName] = useState(user?.name);
  const [id, setId] = useState(user?.id);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [unit, setUnit] = useState('영등포 직영지점');
  const [service, setService] = useState('설계사');
  const [hp, setHp] = useState('');
  const [email, setEmail] = useState(user?.email);

  return (
    <Layout scrollable={false}>
      <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={{ padding: 20 }}>
          <View>
            <CommonText labelText="이름" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={name}
              onChangeText={setName}
              inputStyle={[styles.inputStyle]}
              placeholder="제목을 입력하세요"
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="아이디(사번)"
              labelTextStyle={[styles.labelStyle]}
            />
            <CommonInput
              value={id}
              onChangeText={setId}
              inputStyle={[styles.inputStyle]}
              placeholder="아이디(사번)을 입력하세요"
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="비밀번호"
              labelTextStyle={[styles.labelStyle]}
            />
            <CommonInput
              value={password}
              onChangeText={setPassword}
              inputStyle={[
                styles.inputStyle,
                { backgroundColor: colors.white },
              ]}
              placeholder="변경하실 비밀번호를 입력하세요"
              placeholderTextColor={colors.gray6}
              secureTextEntry={true}
            />
            <CommonInput
              value={rePassword}
              onChangeText={setRePassword}
              inputStyle={[
                styles.inputStyle,
                { backgroundColor: colors.white, marginTop: 10 },
              ]}
              placeholder="비밀번호 확인"
              placeholderTextColor={colors.gray6}
              secureTextEntry={true}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText labelText="소속" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={unit}
              onChangeText={setUnit}
              inputStyle={[styles.inputStyle]}
              placeholder="소속을 입력해주세요"
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText labelText="자격" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={service}
              onChangeText={setService}
              inputStyle={[styles.inputStyle]}
              placeholder="자격을 입력해주세요"
              placeholderTextColor={colors.gray6}
              editable={false}
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="연락처"
              labelTextStyle={[styles.labelStyle]}
            />
            <CommonInput
              value={hp}
              onChangeText={setHp}
              inputStyle={[
                styles.inputStyle,
                { backgroundColor: colors.white },
              ]}
              placeholder="연락처를 입력해주세요"
              placeholderTextColor={colors.gray6}
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="이메일"
              labelTextStyle={[styles.labelStyle]}
            />
            <CommonInput
              value={email}
              onChangeText={setEmail}
              inputStyle={[
                styles.inputStyle,
                { backgroundColor: colors.white },
              ]}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor={colors.gray6}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: colors.gray1,
        }}
      >
        <TouchableOpacity
          style={{
            height: 52,
            borderRadius: 30,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonText
            labelText="저장"
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
