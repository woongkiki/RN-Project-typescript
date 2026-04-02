import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import CommonText from './CommonText';
import { BASE_URL } from '../api/util';

interface AddressData {
  address: string; // 도로명 주소
  zonecode: string; // 우편번호
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (data: AddressData) => void;
}

export default function DaumAddressModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <CommonText
              labelText="주소 검색"
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 18, color: colors.gray10 },
              ]}
            />
            <TouchableOpacity onPress={onClose}>
              <CommonText labelText="닫기" />
            </TouchableOpacity>
          </View>

          {/* WebView */}
          <WebView
            source={{ uri: BASE_URL + '/post_code.html' }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loading}>
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            )}
            onMessage={e => {
              try {
                const data: AddressData = JSON.parse(e.nativeEvent.data);
                onSelect(data);
                onClose();
              } catch {}
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
