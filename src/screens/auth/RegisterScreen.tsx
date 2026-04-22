import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import CommonInput from '../../components/CommonInput';
import CommonText from '../../components/CommonText';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import {
  getJoinStatusApi,
  getOfficesApi,
  getTermsApi,
  registerApi,
  OfficeItem,
  TermsItem,
} from '../../api/auth';
import { BASE_URL } from '../../api/util';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterScreen'>;

// ── 영업점 선택 바텀시트 ──────────────────────────────────────────────
interface OfficeSelectorProps {
  visible: boolean;
  offices: OfficeItem[];
  selectedIdx: number | null;
  onSelect: (office: OfficeItem) => void;
  onClose: () => void;
}

function OfficeSelector({
  visible,
  offices,
  selectedIdx,
  onSelect,
  onClose,
}: OfficeSelectorProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: insets.bottom,
            maxHeight: '70%',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.gray3,
                marginBottom: 12,
              }}
            />
            <CommonText
              labelText="영업점 선택"
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 18, color: colors.gray10 },
              ]}
            />
          </View>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {offices.map((office, index) => {
              const isSelected = selectedIdx === office.idx;
              return (
                <TouchableOpacity
                  key={office.idx}
                  onPress={() => {
                    onSelect(office);
                    onClose();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: index < offices.length - 1 ? 1 : 0,
                    borderBottomColor: colors.gray1,
                    backgroundColor: isSelected
                      ? colors.primary3
                      : colors.white,
                  }}
                >
                  <View>
                    <CommonText
                      labelText={office.name}
                      labelTextStyle={[
                        fonts.medium,
                        { fontSize: 16 },
                        isSelected && {
                          color: colors.primary,
                          ...fonts.semiBold,
                        },
                      ]}
                    />
                    {office.phone ? (
                      <CommonText
                        labelText={office.phone}
                        labelTextStyle={{
                          fontSize: 13,
                          color: colors.gray6,
                          marginTop: 2,
                        }}
                      />
                    ) : null}
                  </View>
                  {isSelected && (
                    <Image
                      source={{ uri: BASE_URL + '/images/check_icon_blue.png' }}
                      style={{ width: 16, height: 16, resizeMode: 'contain' }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── 약관 상세 팝업 ────────────────────────────────────────────────────
interface TermsDetailModalProps {
  terms: TermsItem | null;
  onClose: () => void;
}

function TermsDetailModal({ terms, onClose }: TermsDetailModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={!!terms}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View
          style={{
            flex: 1,
            marginTop: 60,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: insets.bottom,
          }}
        >
          {/* 헤더 */}
          <View style={styles.termsModalHeader}>
            <CommonText
              labelText={terms?.title ?? ''}
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 17, color: colors.gray10, flex: 1 },
              ]}
            />
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CommonText
                labelText="닫기"
                labelTextStyle={[
                  fonts.medium,
                  { fontSize: 15, color: colors.primary },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* 버전 */}
          {terms?.version ? (
            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
              <CommonText
                labelText={`버전 ${terms.version}`}
                labelTextStyle={{ fontSize: 12, color: colors.gray6 }}
              />
            </View>
          ) : null}

          {/* 본문 */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            <CommonText
              labelText={terms?.content ?? ''}
              labelTextStyle={{
                fontSize: 14,
                color: colors.gray9,
                lineHeight: 22,
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── 체크박스 컴포넌트 ─────────────────────────────────────────────────
interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  onDetailPress?: () => void;
}

function TermsCheckbox({
  checked,
  onPress,
  label,
  onDetailPress,
}: CheckboxProps) {
  return (
    <View style={styles.checkboxRow}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: checked ? colors.primary : colors.gray3,
              backgroundColor: checked ? colors.primary : colors.white,
            },
          ]}
        >
          {checked && (
            <Image
              source={{ uri: BASE_URL + '/images/check_icon_white.png' }}
              style={{ width: 10, height: 8, resizeMode: 'contain' }}
            />
          )}
        </View>
        <CommonText
          labelText={label}
          labelTextStyle={[
            fonts.regular,
            { fontSize: 14, color: colors.gray9, flex: 1 },
          ]}
        />
      </TouchableOpacity>
      {onDetailPress && (
        <TouchableOpacity
          onPress={onDetailPress}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <CommonText
            labelText="자세히"
            labelTextStyle={[
              fonts.medium,
              { fontSize: 13, color: colors.primary },
            ]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── 권한 선택 바텀시트 ────────────────────────────────────────────────
type RoleValue = 'BA' | 'BM' | 'TL' | 'FP';

const ROLE_OPTIONS: { value: RoleValue; label: string }[] = [
  { value: 'BA', label: '최고관리자' },
  { value: 'BM', label: '일반관리자' },
  { value: 'TL', label: '팀장' },
  { value: 'FP', label: '직원' },
];

interface RoleSelectorProps {
  visible: boolean;
  selectedRole: RoleValue | null;
  onSelect: (role: RoleValue) => void;
  onClose: () => void;
}

function RoleSelector({ visible, selectedRole, onSelect, onClose }: RoleSelectorProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: insets.bottom,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray1,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.gray3,
                marginBottom: 12,
              }}
            />
            <CommonText
              labelText="권한 선택"
              labelTextStyle={[fonts.semiBold, { fontSize: 18, color: colors.gray10 }]}
            />
          </View>
          {ROLE_OPTIONS.map((option, index) => {
            const isSelected = selectedRole === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => { onSelect(option.value); onClose(); }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderBottomWidth: index < ROLE_OPTIONS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.gray1,
                  backgroundColor: isSelected ? colors.primary3 : colors.white,
                }}
              >
                <CommonText
                  labelText={option.label}
                  labelTextStyle={[
                    fonts.medium,
                    { fontSize: 16 },
                    isSelected && { color: colors.primary, ...fonts.semiBold },
                  ]}
                />
                {isSelected && (
                  <Image
                    source={{ uri: BASE_URL + '/images/check_icon_blue.png' }}
                    style={{ width: 16, height: 16, resizeMode: 'contain' }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── 전화번호 자동 포매터 ──────────────────────────────────────────────
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('02')) {
    // 서울 지역번호: 02-XXX-XXXX / 02-XXXX-XXXX
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  } else {
    // 휴대폰·기타: XXX-XXX-XXXX / XXX-XXXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};

// ── 메인 화면 ────────────────────────────────────────────────────────
export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [offices, setOffices] = useState<OfficeItem[]>([]);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<OfficeItem | null>(null);
  const [officeModalVisible, setOfficeModalVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState<RoleValue>('FP');
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const [terms, setTerms] = useState<TermsItem[]>([]);
  const [agreedIdxs, setAgreedIdxs] = useState<Set<number>>(new Set());
  const [allAgreed, setAllAgreed] = useState(false);
  const [detailTerms, setDetailTerms] = useState<TermsItem | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 진입 시 회원가입 가능 여부 재확인
    getJoinStatusApi()
      .then(enabled => {
        if (!enabled) {
          Alert.alert('알림', '현재 회원가입을 사용할 수 없습니다.', [
            { text: '확인', onPress: () => navigation.goBack() },
          ]);
        }
      })
      .catch(e => {
        console.log('[RegisterScreen] getJoinStatusApi error:', e);
        Alert.alert('알림', '회원가입 상태 확인에 실패했습니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      });

    getOfficesApi()
      .then(data => setOffices(data))
      .catch(e => {
        console.log('[RegisterScreen] getOfficesApi error:', e);
        Alert.alert(
          '알림',
          '영업점 목록을 불러오지 못했습니다.\n잠시 후 다시 시도해주세요.',
        );
      })
      .finally(() => setOfficesLoading(false));

    getTermsApi()
      .then(data => setTerms(data))
      .catch(e => {
        console.log('[RegisterScreen] getTermsApi error:', e);
      });
  }, []);

  // 전체 동의 토글
  const handleAllAgree = () => {
    if (allAgreed) {
      setAgreedIdxs(new Set());
      setAllAgreed(false);
    } else {
      setAgreedIdxs(new Set(terms.map(t => t.idx)));
      setAllAgreed(true);
    }
  };

  // 개별 약관 토글
  const handleToggleTerm = (idx: number) => {
    const next = new Set(agreedIdxs);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setAgreedIdxs(next);
    setAllAgreed(next.size === terms.length);
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }
    if (!loginId.trim()) {
      Alert.alert('알림', '아이디(사번)를 입력해주세요.');
      return;
    }
    if (!password) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자리 이상이어야 합니다.');
      return;
    }
    if (password !== rePassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!selectedOffice) {
      Alert.alert('알림', '영업점을 선택해주세요.');
      return;
    }
    if (!selectedRole) {
      Alert.alert('알림', '권한을 선택해주세요.');
      return;
    }
    if (terms.length > 0 && agreedIdxs.size !== terms.length) {
      Alert.alert('알림', '모든 약관에 동의해주세요.');
      return;
    }

    try {
      setSaving(true);
      await registerApi({
        name: name.trim(),
        login_id: loginId.trim(),
        password,
        office_idx: selectedOffice.idx,
        role: selectedRole,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        agreed_term_idxs: Array.from(agreedIdxs),
      });
      Alert.alert('알림', '회원가입이 완료되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const message = e instanceof Error ? e.message : '회원가입에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaProvider>
      <Layout scrollable={false}>
        <SubHeader
          headerLabel="회원가입"
          headerLeftOnPress={() => navigation.goBack()}
        />
        <ScrollView>
          <View style={{ padding: 20 }}>
            {/* 이름 */}
            <View>
              <CommonText labelText="이름" labelTextStyle={styles.labelStyle} />
              <CommonInput
                value={name}
                onChangeText={setName}
                inputStyle={styles.editableInput}
                placeholder="이름을 입력해주세요"
                placeholderTextColor={colors.gray6}
              />
            </View>

            {/* 아이디(사번) */}
            <View style={styles.boxMargin}>
              <CommonText
                labelText="아이디(사번)"
                labelTextStyle={styles.labelStyle}
              />
              <CommonInput
                value={loginId}
                onChangeText={setLoginId}
                inputStyle={styles.editableInput}
                placeholder="아이디(사번)를 입력해주세요"
                placeholderTextColor={colors.gray6}
                autoCapitalize="none"
              />
            </View>

            {/* 비밀번호 */}
            <View style={styles.boxMargin}>
              <CommonText
                labelText="비밀번호"
                labelTextStyle={styles.labelStyle}
              />
              <CommonInput
                value={password}
                onChangeText={setPassword}
                inputStyle={styles.editableInput}
                placeholder="비밀번호를 입력해주세요 (6자리 이상)"
                placeholderTextColor={colors.gray6}
                secureTextEntry
              />
              <CommonInput
                value={rePassword}
                onChangeText={setRePassword}
                inputStyle={[styles.editableInput, { marginTop: 10 }]}
                placeholder="비밀번호 확인"
                placeholderTextColor={colors.gray6}
                secureTextEntry
              />
            </View>

            {/* 영업점 선택 */}
            <View style={styles.boxMargin}>
              <CommonText
                labelText="영업점"
                labelTextStyle={styles.labelStyle}
              />
              <TouchableOpacity
                onPress={() => !officesLoading && setOfficeModalVisible(true)}
                style={[
                  styles.selectBox,
                  selectedOffice && { borderColor: colors.primary },
                ]}
                activeOpacity={0.7}
              >
                {officesLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <CommonText
                      labelText={
                        selectedOffice
                          ? selectedOffice.name
                          : '영업점을 선택해주세요'
                      }
                      labelTextStyle={[
                        fonts.regular,
                        {
                          fontSize: 15,
                          color: selectedOffice ? colors.gray10 : colors.gray6,
                          flex: 1,
                        },
                      ]}
                    />
                    <Image
                      source={{ uri: BASE_URL + '/images/arrow_down_icon.png' }}
                      style={{
                        width: 14,
                        height: 14,
                        resizeMode: 'contain',
                        tintColor: colors.gray6,
                      }}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* 권한 선택 */}
            <View style={styles.boxMargin}>
              <CommonText labelText="권한" labelTextStyle={styles.labelStyle} />
              <TouchableOpacity
                onPress={() => setRoleModalVisible(true)}
                style={[styles.selectBox, { borderColor: colors.primary }]}
                activeOpacity={0.7}
              >
                <CommonText
                  labelText={ROLE_OPTIONS.find(r => r.value === selectedRole)?.label ?? ''}
                  labelTextStyle={[
                    fonts.regular,
                    { fontSize: 15, color: colors.gray10, flex: 1 },
                  ]}
                />
                <Image
                  source={{ uri: BASE_URL + '/images/arrow_down_icon.png' }}
                  style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: colors.gray6 }}
                />
              </TouchableOpacity>
            </View>

            {/* 연락처 */}
            <View style={styles.boxMargin}>
              <CommonText
                labelText="연락처"
                labelTextStyle={styles.labelStyle}
              />
              <CommonInput
                value={phone}
                onChangeText={text => setPhone(formatPhone(text))}
                inputStyle={styles.editableInput}
                placeholder="연락처를 입력해주세요"
                placeholderTextColor={colors.gray6}
                keyboardType="number-pad"
                maxLength={13}
              />
            </View>

            {/* 이메일 */}
            <View style={styles.boxMargin}>
              <CommonText
                labelText="이메일"
                labelTextStyle={styles.labelStyle}
              />
              <CommonInput
                value={email}
                onChangeText={setEmail}
                inputStyle={styles.editableInput}
                placeholder="이메일을 입력해주세요"
                placeholderTextColor={colors.gray6}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 약관 동의 */}
            {terms.length > 0 && (
              <View style={[styles.boxMargin, styles.termsBox]}>
                {/* 전체 동의 */}
                <TermsCheckbox
                  checked={allAgreed}
                  onPress={handleAllAgree}
                  label="전체 약관에 동의합니다"
                />
                <View style={styles.termsDivider} />

                {/* 개별 약관 */}
                {terms.map(term => (
                  <TermsCheckbox
                    key={term.idx}
                    checked={agreedIdxs.has(term.idx)}
                    onPress={() => handleToggleTerm(term.idx)}
                    label={`[필수] ${term.title}`}
                    onDetailPress={() => setDetailTerms(term)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleRegister}
            disabled={saving}
            style={[
              styles.submitButton,
              { backgroundColor: saving ? colors.gray4 : colors.primary },
            ]}
          >
            <CommonText
              labelText={saving ? '처리 중...' : '회원가입'}
              labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
            />
          </TouchableOpacity>
        </View>

        <OfficeSelector
          visible={officeModalVisible}
          offices={offices}
          selectedIdx={selectedOffice?.idx ?? null}
          onSelect={setSelectedOffice}
          onClose={() => setOfficeModalVisible(false)}
        />

        <RoleSelector
          visible={roleModalVisible}
          selectedRole={selectedRole}
          onSelect={setSelectedRole}
          onClose={() => setRoleModalVisible(false)}
        />

        <TermsDetailModal
          terms={detailTerms}
          onClose={() => setDetailTerms(null)}
        />
      </Layout>
    </SafeAreaProvider>
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
  editableInput: {
    borderWidth: 1,
    borderColor: colors.gray3,
    height: 50,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  selectBox: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray3,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  termsBox: {
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    backgroundColor: colors.white,
  },
  termsDivider: {
    height: 1,
    backgroundColor: colors.gray1,
    marginVertical: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
  },
  submitButton: {
    height: 52,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
