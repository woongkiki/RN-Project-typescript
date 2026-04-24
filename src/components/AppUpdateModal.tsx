import React from 'react';
import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { ANDROID_STORE_URL, IOS_STORE_URL } from '../api/util';
import CommonText from './CommonText';

interface Props {
  visible: boolean;
  latestVersion: string;
  onClose: () => void;
}

export default function AppUpdateModal({
  visible,
  latestVersion,
  onClose,
}: Props) {
  const storeUrl = Platform.OS === 'android' ? ANDROID_STORE_URL : IOS_STORE_URL;

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <CommonText
            labelText="업데이트 안내"
            labelTextStyle={[fonts.semiBold, styles.title]}
          />
          <CommonText
            labelText={`새로운 버전(${latestVersion})이 출시되었습니다.\n최신 버전으로 업데이트해 주세요.`}
            labelTextStyle={[styles.message]}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.laterBtn} onPress={onClose}>
              <CommonText
                labelText="나중에"
                labelTextStyle={[fonts.medium, styles.laterText]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateBtn, !storeUrl && styles.updateBtnDisabled]}
              onPress={handleUpdate}
              disabled={!storeUrl}
            >
              <CommonText
                labelText="업데이트"
                labelTextStyle={[fonts.semiBold, styles.updateText]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    color: colors.gray10,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.gray7,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  laterBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterText: {
    fontSize: 15,
    color: colors.gray7,
  },
  updateBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnDisabled: {
    backgroundColor: colors.gray4,
  },
  updateText: {
    fontSize: 15,
    color: colors.white,
  },
});
