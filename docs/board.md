API 엔드포인트 목록

모든 엔드포인트는 Authorization: Bearer {JWT} 헤더 필요

┌────────┬──────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────┐
│ Method │ URL │ 설명 │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/categories │ 카테고리 목록 (?board_type=general 생략 시 전체) │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/posts │ 게시글 목록 (?board_type=general&category_idx=1&keyword=보험&page=1&limit=20) │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/post/{idx} │ 게시글 상세 (boardType 무관) │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/education/videos │ 동영상 목록 (?category_idx=&keyword=) │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/education/video/{idx} │ 동영상 상세 (youtube_id, description 파싱) │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/education/docs │ 교육자료 목록 │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/education/doc/{idx} │ 교육자료 상세 (files 포함) │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/seminars │ 세미나 목록 │
├────────┼──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│ GET │ /api/app/board/seminar/{idx} │ 세미나 상세 (start_at, end_at, deadline, capacity 등 파싱) │
└────────┴──────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────┘

---

주요 설계 포인트

- JWT 기반: AppAuthMiddleware가 검증한 $GLOBALS['app_jwt_payload']에서 office_idx 추출 → 영업점 RDS 자동 접속
- 기존 BoardRepository 재사용: 별도 레포지토리 없이 웹과 동일한 DB 쿼리 사용
- 동영상/교육자료 분리: content 필드가 {"youtube_id": "..."} JSON이면 영상, 아니면 자료로 판별
- 세미나 content 파싱: start_at / end_at / deadline / capacity / registered_count / thumbnail_url 자동 언패킹
- 응답 형식: json_app_success (키: success / message / data)

수정이 필요한 파일 3개입니다.

⏺ Update(src/app/Domain/App/Board/Repository/AppBoardRepository.php)
⎿ Added 7 lines
127 $stmt->execute([$postIdx]);
128 return $stmt->fetchAll();
      129      }
      130 +                                                                                                                                          
      131 +    public function insertFile(int $postIdx, string $fileName, string $filePath, int $fileSize): void                                     
      132 +    {                                                                                                                                     
      133 +        $this->pdo->prepare(                                                                                                              
      134 +            'INSERT INTO tbl_board_files (post_idx, file_name, file_path, file_size, created_at) VALUES (?,?,?,?,NOW())'                  
      135 +        )->execute([$postIdx, $fileName, $filePath, $fileSize]);  
 136 + }  
 137 }

⏺ Update(src/app/Domain/App/Board/Service/AppBoardService.php)
⎿ Added 1 line
2  
 3 namespace App\Domain\App\Board\Service;
4  
 5 +use App\Common\FileUpload;  
 6 use App\Domain\App\Board\Repository\AppBoardRepository;
7  
 8 class AppBoardService

⏺ Update(src/app/Domain/App/Board/Service/AppBoardService.php)
⎿ Added 16 lines, removed 1 line
174 'account_idx' => $accountIdx,
      175          ];
      176  
      177 -        return $this->repo->insertPost($postData);  
 177 + $postIdx = $this->repo->insertPost($postData);  
 178 +  
 179 + // 파일 첨부 처리 (multipart/form-data로 전송된 경우)  
 180 + if (!empty($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {                                                      
      181 +            $file = $_FILES['file'];                                                                                                      
      182 +            $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));  
 183 +  
 184 + $imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];                                                                           
      185 +            $result = in_array($ext, $imageExts, true)                                                                                    
      186 +                ? FileUpload::uploadImage($file, 'board')  
 187 + : FileUpload::uploadFile($file, 'board');                                                                                 
      188 +                                                                                                                                          
      189 +            $this->repo->insertFile($postIdx, $result['file_name'], $result['file_path'], $result['file_size']);  
 190 + }  
 191 +  
 192 + return $postIdx;  
 193 }
194  
 195 // ============================================================

⏺ 마지막으로 컨트롤러에서 JSON 바디 대신 $\_POST를 읽도록 변경합니다.

⏺ Update(src/app/Domain/App/Board/Controller/AppBoardController.php)
⎿ Added 3 lines, removed 1 line
195 $payload    = $GLOBALS['app_jwt_payload'] ?? [];
      196          $accountIdx = (int)($payload['account_idx'] ?? 0);
197  
 198 - $body = $this->getJsonBody();                                                                                                     
      198 +        // 파일 첨부 여부에 따라 multipart/form-data 또는 JSON 바디 모두 지원                                                             
      199 +        $body = !empty($\_POST) ? $_POST : $this->getJsonBody();                                                                           
      200 +                                                                                                                                          
      201          if (empty($body['title']) || empty($body['content']) || empty($body['board_type'])) {
202 json_app_error('OBRD-010', 'board_type, title, content는 필수입니다', 422);
203 }

⏺ 완료됐습니다.

---

변경 사항

┌────────────────────┬──────────────────────────────┐
│ 파일 │ 변경 내용 │
├────────────────────┼──────────────────────────────┤
│ AppBoardRepository │ insertFile() 메서드 추가 │
├────────────────────┼──────────────────────────────┤
│ AppBoardService │ 파일 업로드 처리 로직 추가 │
├────────────────────┼──────────────────────────────┤
│ AppBoardController │ $\_POST / JSON 바디 겸용 처리 │
└────────────────────┴──────────────────────────────┘

앱에서 요청 방법

파일 없을 때 → JSON 그대로
파일 있을 때 → multipart/form-data로 전송

const formData = new FormData();
formData.append('board_type', 'free');
formData.append('title', '제목');
formData.append('content', '내용');
formData.append('file', {
uri: fileUri,
name: fileName,
type: mimeType,
} as any);

fetch('/api/app/board/post', {
method: 'POST',
headers: { Authorization: `Bearer ${token}` },
body: formData,
});

허용 파일 형식: 이미지(jpg/png/gif/webp, 5MB), 문서(pdf/xlsx/docx, 20MB)
