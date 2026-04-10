import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonText from '../../components/CommonText';
import CommonInput from '../../components/CommonInput';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import { BASE_URL } from '../../api/util';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import CategorySelectModal from '../../components/CategorySelectModal';
import { createBoardPost, getBoardCategories } from '../../api/board';
import { BoardCategory } from '../../types';

type Props = NativeStackScreenProps<MainStackParamList, 'BoardForm'>;

export default function BoardForm({ navigation }: Props) {
  const { width } = useAppDimensions();

  const [categoryModal, setCategoryModal] = useState(false);
  const [categories, setCategories] = useState<BoardCategory[]>([]);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileData, setFileData] = useState<DocumentPickerResponse | null>(null);

  useEffect(() => {
    getBoardCategories('free')
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleFilePick = async () => {
    try {
      if (Platform.OS === 'android' && Number(Platform.Version) < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: '파일 접근 권한',
            message: '파일 첨부를 위해 저장소 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거절',
            buttonPositive: '허용',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            '권한 거절',
            '파일 첨부를 위해 저장소 권한이 필요합니다.',
          );
          return;
        }
      }

      const [res] = await pick({
        type: [types.allFiles],
        copyTo: 'cachesDirectory',
      });

      setFileData(res);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        // 사용자 취소 → 아무 동작 안 함
      } else {
        console.error('파일 선택 오류:', err);
        Alert.alert('오류', '파일 선택 중 오류가 발생했습니다.');
      }
    }
  };

  const handleFileRemove = () => {
    setFileData(null);
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert('알림', '카테고리를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    const selectedCategory = categories.find(c => c.name === category);
    try {
      await createBoardPost({
        boardType: 'free',
        categoryIdx: selectedCategory?.idx ?? null,
        title: title.trim(),
        content: content.trim(),
        file: fileData
          ? {
              uri: fileData.fileCopyUri ?? fileData.uri ?? '',
              name: fileData.name ?? '',
              type: fileData.type ?? 'application/octet-stream',
            }
          : null,
      });
      Alert.alert('알림', '게시글이 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log('error', e);
      Alert.alert('오류', '게시글 등록에 실패했습니다.');
    }
  };

  return (
    <Layout
      footerChildren={
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: colors.gray1,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              height: 52,
              borderRadius: 30,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CommonText
              labelText="등록"
              labelTextStyle={[fonts.semiBold, { fontSize: 16, color: '#fff' }]}
            />
          </TouchableOpacity>
        </View>
      }
    >
      <SubHeader
        headerLabel="게시글 작성"
        headerLeftOnPress={() => navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20 }}>
          {/* 카테고리 */}
          <View>
            <CommonText
              labelText="카테고리"
              labelTextStyle={[styles.labelStyle]}
            />
            <TouchableOpacity
              onPress={() => setCategoryModal(true)}
              style={[
                styles.row,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.gray3,
                  minHeight: 50,
                },
              ]}
            >
              <CommonText
                labelText={
                  category !== '' ? category : '카테고리를 선택해주세요.'
                }
                labelTextStyle={[
                  {
                    fontSize: 16,
                    color: category ? colors.gray10 : colors.gray6,
                  },
                ]}
              />
              <Image
                source={{ uri: BASE_URL + '/images/down_tri_arr.png' }}
                style={{ width: 12, height: 8, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>

          {/* 제목 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="제목" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={title}
              onChangeText={setTitle}
              inputStyle={[styles.inputStyle]}
              placeholder="제목을 입력하세요"
              placeholderTextColor={colors.gray6}
            />
          </View>

          {/* 내용 */}
          <View style={[styles.boxMargin]}>
            <CommonText labelText="내용" labelTextStyle={[styles.labelStyle]} />
            <CommonInput
              value={content}
              onChangeText={setContent}
              inputStyle={[styles.inputStyle, styles.textAreaStyle]}
              placeholder="내용을 입력하세요"
              placeholderTextColor={colors.gray6}
              multiline={true}
              textAlignVertical={'top'}
            />
          </View>

          {/* 파일첨부 */}
          <View style={[styles.boxMargin]}>
            <CommonText
              labelText="파일첨부"
              labelTextStyle={[styles.labelStyle]}
            />
            <TouchableOpacity
              onPress={handleFilePick}
              style={[
                styles.row,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.gray3,
                  minHeight: 50,
                },
              ]}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <CommonText
                  labelText={fileData?.name ?? '첨부하실 파일을 업로드하세요'}
                  labelTextStyle={[
                    styles.fileName,
                    fileData ? { color: colors.gray10 } : undefined,
                  ]}
                  numberOfLines={1}
                />
              </View>

              <View style={[styles.row, { gap: 8, alignItems: 'center' }]}>
                {fileData && (
                  <TouchableOpacity
                    onPress={handleFileRemove}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Image
                      source={{ uri: BASE_URL + '/images/close_icon.png' }}
                      style={{ width: 16, height: 16, resizeMode: 'contain' }}
                    />
                  </TouchableOpacity>
                )}
                <View style={[styles.fileBox]}>
                  <CommonText
                    labelText="파일첨부"
                    labelTextStyle={[styles.fileBoxText]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CategorySelectModal
        visible={categoryModal}
        onClose={() => setCategoryModal(false)}
        selectedCategory={category}
        onSelect={setCategory}
        categories={categories.map(c => c.name)}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  boxMargin: {
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
  },
  labelStyle: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.gray9,
    marginBottom: 10,
  },
  inputStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.gray3,
    height: 50,
    fontSize: 16,
  },
  textAreaStyle: {
    height: 160,
    padding: 15,
  },
  fileName: {
    fontSize: 16,
    color: colors.gray6,
  },
  fileBox: {
    width: 66,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.gray9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBoxText: {
    ...fonts.semiBold,
    fontSize: 12,
    color: '#fff',
  },
});
