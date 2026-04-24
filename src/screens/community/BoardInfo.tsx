import React, { useEffect, useState } from 'react';
import { MainStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDimensions } from '../../hooks/useAppDimensions';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import CommonText from '../../components/CommonText';
import { fonts } from '../../constants/fonts';
import Bar from '../../components/Bar';
import CommonConfirmModal from '../../components/CommonConfirmModal';
import { BASE_URL, BASE_URL2 } from '../../api/util';
import { downloadFile } from '../../utils/downloadFile';
import CommonInput from '../../components/CommonInput';
import {
  getBoardPost,
  getBoardComments,
  createBoardComment,
  deleteBoardComment,
  BoardComment,
} from '../../api/board';
import { BoardPost } from '../../types';
import { useAuthStore } from '../../store';

type Props = NativeStackScreenProps<MainStackParamList, 'BoardInfo'>;

const toDate = (iso: string | null | undefined) =>
  iso?.slice(0, 10).replace(/-/g, '.') ?? '';

const toShortDate = (iso: string | null | undefined) =>
  iso?.slice(2, 10).replace(/-/g, '.') ?? '';

export default function BoardInfo({ route, navigation }: Props) {
  const { idx } = route.params;
  const { width } = useAppDimensions();
  const user = useAuthStore(state => state.user);

  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<BoardComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [deleteTargetIdx, setDeleteTargetIdx] = useState<number | null>(null);

  const postIdx = parseInt(idx, 10);

  useEffect(() => {
    console.log('[BoardInfo] postIdx:', postIdx);
    getBoardPost(postIdx)
      .then(data => {
        console.log('[BoardInfo] getBoardPost 응답:', JSON.stringify(data));
        setPost(data);
        if (data.boardType === 'free') {
          return getBoardComments(postIdx).then(setComments);
        }
      })
      .catch(e => {
        console.log('[BoardInfo] 에러:', e?.message ?? e);
        Alert.alert('오류', '게시글을 불러올 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, [postIdx]);

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    setCommentSubmitting(true);
    try {
      const newIdx = await createBoardComment(postIdx, commentInput.trim());
      const newComment: BoardComment = {
        idx: newIdx,
        accountName: user?.name ?? '',
        content: commentInput.trim(),
        createdAt: new Date().toISOString(),
        isMine: true,
      };
      setComments(prev => [...prev, newComment]);
      setCommentInput('');
      Keyboard.dismiss();
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '댓글 등록에 실패했습니다.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentDelete = async () => {
    if (deleteTargetIdx == null) return;
    try {
      await deleteBoardComment(deleteTargetIdx);
      setComments(prev => prev.filter(c => c.idx !== deleteTargetIdx));
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '댓글 삭제에 실패했습니다.');
    } finally {
      setDeleteTargetIdx(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <SubHeader headerLabel="" headerLeftOnPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout
      scrollable={true}
      footerChildren={
        post?.boardType === 'free' ? (
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
              multiline={true}
              textAlignVertical="top"
              scrollEnabled={true}
              inputStyle={{
                width: width - 95,
                minHeight: 50,
                maxHeight: 120,
                height: undefined,
                paddingTop: 14,
                paddingBottom: 14,
              }}
            />
            <TouchableOpacity
              onPress={handleCommentSubmit}
              disabled={commentSubmitting || !commentInput.trim()}
              style={{
                width: 45,
                height: 50,
                borderRadius: 6,
                backgroundColor:
                  commentSubmitting || !commentInput.trim()
                    ? colors.gray4
                    : colors.gray9,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
              }}
            >
              {commentSubmitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <CommonText
                  labelText="등록"
                  labelTextStyle={[
                    fonts.semiBold,
                    { fontSize: 12, color: colors.white },
                  ]}
                />
              )}
            </TouchableOpacity>
          </View>
        ) : undefined
      }
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
            labelText={post ? `[${post.categoryName ?? ''}] ${post.title}` : ''}
            style={[styles.titleText]}
          />
          <CommonText
            labelText={post ? toDate(post.createdAt) : ''}
            style={[styles.dateText]}
          />
        </View>
        <View style={[styles.contentWrap]}>
          {/* 첨부파일 */}
          {post?.files.map(file => (
            <TouchableOpacity
              key={file.idx}
              style={[styles.row, styles.fileDownWrap]}
              onPress={() => {
                downloadFile(BASE_URL2 + file.filePath, file.fileName);
              }}
            >
              <View style={{ width: width - 90 }}>
                <CommonText
                  labelText={file.fileName}
                  numberOfLines={1}
                  labelTextStyle={[styles.fileText]}
                />
              </View>
              <Image
                source={{ uri: BASE_URL + '/images/down_icon_sky.png' }}
                style={{ width: 12, height: 14, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          ))}
          {/* 본문 */}
          <View>
            <CommonText
              labelText={post?.content ?? ''}
              labelTextStyle={[styles.contentText]}
            />
          </View>
        </View>
      </View>

      {post?.boardType === 'free' && (
        <>
          <Bar />
          <View style={[styles.commentWrap]}>
            <CommonText
              labelText={`댓글 ${comments.length}`}
              style={[styles.commentLabel]}
            />
            <View>
              {comments.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <CommonText
                    labelText="첫 댓글을 남겨보세요."
                    labelTextStyle={{ fontSize: 14, color: colors.gray6 }}
                  />
                </View>
              ) : (
                comments.map(comment => (
                  <View key={comment.idx} style={[styles.commentBoxWrap]}>
                    <View
                      style={[
                        styles.row,
                        { alignItems: 'center', justifyContent: 'space-between' },
                      ]}
                    >
                      <View style={[styles.row, { alignItems: 'center', gap: 4 }]}>
                        <CommonText
                          labelText={
                            comment.accountName
                              ? `${comment.accountName}님의 댓글`
                              : '댓글'
                          }
                          style={[fonts.semiBold, { color: colors.gray10 }]}
                        />
                        {comment.isMine && (
                          <TouchableOpacity
                            onPress={() => setDeleteTargetIdx(comment.idx)}
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
                        )}
                      </View>
                      <CommonText
                        labelText={toShortDate(comment.createdAt)}
                        labelTextStyle={[{ color: colors.gray6, fontSize: 12 }]}
                      />
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <CommonText
                        labelText={comment.content}
                        labelTextStyle={[
                          { fontSize: 14, color: colors.gray8, lineHeight: 20 },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </>
      )}

      <CommonConfirmModal
        visible={deleteTargetIdx !== null}
        message="댓글을 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        onCancel={() => setDeleteTargetIdx(null)}
        onConfirm={handleCommentDelete}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  titleWrap: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  titleText: { ...fonts.semiBold, fontSize: 20, color: colors.gray10 },
  dateText: { fontSize: 12, color: colors.gray6, marginTop: 15 },
  contentWrap: { marginTop: 15 },
  contentText: { fontSize: 15, color: colors.gray8, lineHeight: 20 },
  fileDownWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 42,
    backgroundColor: colors.gray1,
    borderRadius: 8,
    marginBottom: 20,
  },
  fileText: { ...fonts.medium, fontSize: 14, color: colors.gray9 },
  commentWrap: { padding: 20 },
  commentLabel: { ...fonts.medium, fontSize: 15, color: colors.gray8 },
  commentBoxWrap: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
});
