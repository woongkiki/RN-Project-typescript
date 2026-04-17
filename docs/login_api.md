API 스펙

POST /api/app/auth/login — 인증 불필요
// Request
{ "login_id": "test", "password": "test" }

// Response 200
{
"success": true,
"message": null,
"data": {
"user": { "idx": 1, "loginId": "test", "name": "홍길동", "role": "FP", "office": {...}, ... },
"token": "eyJ...",
"firstlogin": false
}
}

PATCH /api/app/auth/me — Authorization: Bearer {token} 필요
// Request (모두 optional)
{ "password": "new_pass", "phone": "01012345678", "email": "new@email.com" }

// Response 200
{ "success": true, "message": "내 정보가 수정되었습니다", "data": [] }

주요 설계 포인트

- 기존 웹 세션 인증과 완전 분리 — 별도 /api/app/ 네임스페이스
- JWT 유효기간 30일 (.env의 JWT_SECRET으로 서명)
- 기존 잠금/비활성 정책 그대로 적용 — 5회 실패 잠금, 영업점 비활성 차단
- 앱 응답 포맷 success/message/data — React Native 앱의 ApiResponse<T> 타입과 일치
- 운영 배포 전 .env의 JWT_SECRET을 강력한 랜덤 값으로 교체 필요
