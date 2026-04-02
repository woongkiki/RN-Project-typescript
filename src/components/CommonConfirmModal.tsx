import React from 'react';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import CommonText from './CommonText';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors';

interface CommonConfirmModalProps {
  visible: boolean;
  message: string;
  cancelText?: string;
  confirmText?: string;
  confirmButtonStyle?: StyleProp<ViewStyle>;
  onCancel?: () => void;
  onConfirm: () => void;
  onRequestClose?: () => void;
  oneButton?: boolean;
}

const CommonConfirmModal = ({
  visible,
  message,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
  onRequestClose,
  oneButton = false,
  confirmButtonStyle,
}: CommonConfirmModalProps) => {
  const { width } = useWindowDimensions();

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose ?? onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={[styles.container, { width: width - 40 }]}>
              <View style={styles.messageWrapper}>
                <CommonText
                  labelText={message}
                  labelTextStyle={[
                    { fontSize: 16, color: colors.gray10, textAlign: 'center' },
                  ]}
                />
              </View>
              <View style={styles.row}>
                {!oneButton && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.gray2 }]}
                    onPress={onCancel}
                  >
                    <CommonText
                      labelText={cancelText}
                      labelTextStyle={[fonts.semiBold, { color: colors.gray7 }]}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colors.mainRed },
                    oneButton && { width: '100%' },
                    confirmButtonStyle,
                  ]}
                  onPress={onConfirm}
                >
                  <CommonText
                    labelText={confirmText}
                    labelTextStyle={[fonts.semiBold, { color: '#fff' }]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  messageWrapper: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommonConfirmModal;
