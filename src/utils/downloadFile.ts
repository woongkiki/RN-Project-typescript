import { Platform, PermissionsAndroid, Alert } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

// 파일 확장자로 mimeType 결정
const getMimeType = (url: string): string => {
  const ext = url.split('.').pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip',
    txt: 'text/plain',
  };
  return mimeMap[ext ?? ''] ?? 'application/octet-stream';
};

// 실제 다운로드 실행
const executeDownload = async (url: string, fileName: string) => {
  const { dirs } = ReactNativeBlobUtil.fs;
  const mimeType = getMimeType(url);

  console.log('dirs', dirs);

  const config = Platform.select({
    android: {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // Android 시스템 다운로드 매니저 사용
        notification: true, // 알림 표시
        mediaScannable: true, // 갤러리 등에서 접근 가능
        title: fileName,
        description: '파일 다운로드 중...',
        mime: mimeType,
        path: `${dirs.LegacyDownloadDir}/${fileName}`,
        // path: `${dirs.DownloadDir}/${fileName}`,
      },
    },
    ios: {
      fileCache: true,
      path: `${dirs.DocumentDir}/${fileName}`,
      appendExt: url.split('.').pop() ?? '',
    },
  });

  try {
    const res = await ReactNativeBlobUtil.config(config ?? {}).fetch(
      'GET',
      url,
    );

    if (Platform.OS === 'ios') {
      // iOS는 파일 공유 창 띄우기
      await ReactNativeBlobUtil.ios.previewDocument(res.path());
    }

    Alert.alert('다운로드 완료', `${fileName} 파일이 저장되었습니다.`);
  } catch (e) {
    console.error('download error:', e);
    Alert.alert('다운로드 실패', '파일 다운로드 중 오류가 발생했습니다.');
  }
};

// 권한 체크 후 다운로드
export const downloadFile = async (url: string, fileName: string) => {
  if (Platform.OS === 'ios') {
    await executeDownload(url, fileName);
    return;
  }

  // Android 버전별 권한 처리
  const androidVersion = Number(Platform.Version);

  if (androidVersion >= 33) {
    // Android 13+ : WRITE 권한 불필요, 바로 다운로드
    await executeDownload(url, fileName);
  } else {
    // Android 12 이하 : WRITE_EXTERNAL_STORAGE 권한 필요
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: '저장소 권한',
        message: '파일 다운로드를 위해 저장소 접근 권한이 필요합니다.',
        buttonNeutral: '나중에',
        buttonNegative: '거절',
        buttonPositive: '허용',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await executeDownload(url, fileName);
    } else {
      Alert.alert(
        '권한 거절',
        '파일 다운로드를 위해 저장소 권한이 필요합니다.',
      );
    }
  }
};
