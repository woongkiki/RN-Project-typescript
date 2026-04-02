import React, { useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import Bar from '../../components/Bar';
import CommonConfirmModal from '../../components/CommonConfirmModal';
import { BASE_URL } from '../../api/util';
import { downloadFile } from '../../utils/downloadFile';
import CommonInput from '../../components/CommonInput';

type Props = NativeStackScreenProps<MainStackParamList, 'BoardInfo'>;

export default function BoardInfo({ route, navigation }: Props) {
  const { idx } = route.params;

  const { width } = useAppDimensions();

  const [commentDelModal, setCommentDelModal] = useState(false);

  const [commentInput, setCommentInput] = useState('');

  return (
    <Layout
      scrollable={true}
      footerChildren={
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <CommonInput
            value={commentInput}
            onChangeText={setCommentInput}
            placeholder="댓글을 입력해주세요"
            multiline={true} // ✅ 멀티라인 활성화
            textAlignVertical="top" // ✅ Android 텍스트 상단 정렬
            scrollEnabled={true} // ✅ maxHeight 초과 시 input 내부 스크롤
            inputStyle={{
              width: width - 95,
              minHeight: 50, // ✅ 기본 높이
              maxHeight: 120, // ✅ 최대 높이 제한
              height: undefined, // ✅ 고정 height 제거 (auto 대신)
              paddingTop: 14,
              paddingBottom: 14,
            }}
          />
          <TouchableOpacity
            style={{
              width: 45,
              height: 50,
              borderRadius: 6,
              backgroundColor: colors.gray9,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}
          >
            <CommonText
              labelText="등록"
              labelTextStyle={[
                fonts.semiBold,
                { fontSize: 12, color: colors.white },
              ]}
            />
          </TouchableOpacity>
        </View>
      }
      // scrollViewStyle={{ padding: 20 }}
      headerChildren={
        <SubHeader
          headerLabel=""
          headerLeftOnPress={() => navigation.goBack()}
        />
      }
    >
      <View style={{ padding: 20 }}>
        <View style={[styles.titleWrap]}>
          <CommonText
            labelText="[생명보험] 연금세일즈"
            style={[styles.titleText]}
          />
          <CommonText labelText="2026.03.13" style={[styles.dateText]} />
        </View>
        <View style={[styles.contentWrap]}>
          <TouchableOpacity
            style={[styles.row, styles.fileDownWrap]}
            onPress={() =>
              downloadFile(
                BASE_URL + '/test.txt', // 실제 파일 URL
                '테스트.txt', // 저장될 파일명
              )
            }
          >
            <View style={{ width: width - 90 }}>
              <CommonText
                labelText="테스트.txt"
                numberOfLines={1}
                labelTextStyle={[styles.fileText]}
              />
            </View>
            <Image
              source={{ uri: BASE_URL + '/images/down_icon_sky.png' }}
              style={{ width: 12, height: 14, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
          <View>
            <CommonText
              labelText={
                '작성한 게시글 내용이 보여집니다.\n작성한 게시글 내용이 보여집니다.작성한 게시글 내용이 보여집니다.작성한 게시글 내용이 보여집니다.\n작성한 게시글 내용이 보여집니다.\n작성한 게시글 내용이 보여집니다.'
              }
              labelTextStyle={[styles.contentText]}
            />
          </View>
        </View>
      </View>
      <Bar />
      <View style={[styles.commentWrap]}>
        <CommonText labelText="댓글 5" style={[styles.commentLabel]} />
        <View>
          <View style={[styles.commentBoxWrap]}>
            <View
              style={[
                styles.row,
                { alignItems: 'center', justifyContent: 'space-between' },
              ]}
            >
              <View style={[styles.row, { alignItems: 'center', gap: 5 }]}>
                <CommonText
                  labelText="홍길동님의 댓글"
                  style={[fonts.semiBold, { color: colors.gray10 }]}
                />
              </View>
              <CommonText
                labelText={'03.13'}
                labelTextStyle={[{ color: colors.gray6, fontSize: 12 }]}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <CommonText
                labelText="약관의 내용은 담보별로 상이하니 구체적으로 어떤 담보에 대한 약관 내용이 궁금하신지 알려주시면 답변 드리기에 더 좋을 거 같습니다^^"
                labelTextStyle={[
                  { fontSize: 14, color: colors.gray8, lineHeight: 20 },
                ]}
              />
            </View>
          </View>
          <View style={[styles.commentBoxWrap]}>
            <View
              style={[
                styles.row,
                { alignItems: 'center', justifyContent: 'space-between' },
              ]}
            >
              <View style={[styles.row, { alignItems: 'center', gap: 4 }]}>
                <CommonText
                  labelText="홍길동님의 댓글"
                  style={[fonts.semiBold, { color: colors.gray10 }]}
                />
                <TouchableOpacity
                  onPress={() => setCommentDelModal(true)}
                  style={{
                    width: 22,
                    height: 21,
                    backgroundColor: colors.gray1,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={{ uri: BASE_URL + '/images/del_icon.png' }}
                    style={{ width: 10, height: 11, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              </View>
              <CommonText
                labelText={'03.13'}
                labelTextStyle={[{ color: colors.gray6, fontSize: 12 }]}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <CommonText
                labelText="약관의 내용은 담보별로 상이하니 구체적으로 어떤 담보에 대한 약관 내용이 궁금하신지 알려주시면 답변 드리기에 더 좋을 거 같습니다^^"
                labelTextStyle={[
                  { fontSize: 14, color: colors.gray8, lineHeight: 20 },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <CommonConfirmModal
        visible={commentDelModal}
        message="댓글을 삭제하시겠습니까?"
        cancelText="취소" // 기본값 '취소' - 생략 가능
        confirmText="삭제" // 기본값 '확인' - 생략 가능
        onCancel={() => setCommentDelModal(false)}
        onConfirm={() => {
          // 삭제 로직
          setCommentDelModal(false);
        }}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrap: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  titleText: {
    ...fonts.semiBold,
    fontSize: 20,
    color: colors.gray10,
  },
  dateText: {
    fontSize: 12,
    color: colors.gray6,
    marginTop: 15,
  },
  contentWrap: {
    marginTop: 15,
  },
  contentText: {
    fontSize: 15,
    color: colors.gray8,
    lineHeight: 20,
  },
  fileDownWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 42,
    backgroundColor: colors.gray1,
    borderRadius: 8,
    marginBottom: 20,
  },
  fileText: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.gray9,
  },
  commentWrap: {
    padding: 20,
  },
  commentLabel: {
    ...fonts.medium,
    fontSize: 15,
    color: colors.gray8,
  },
  commentBoxWrap: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
});
