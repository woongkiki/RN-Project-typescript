패턴 파악 완료. 3개 파일 생성합니다.

⏺ Write(src/app/Domain/App/Customer/Repository/AppCustomerRepository.php)
⎿ Wrote 216 lines to src/app/Domain/App/Customer/Repository/AppCustomerRepository.php
1 <?php
2
3 namespace App\Domain\App\Customer\Repository;
4
5 use App\Database\Connection;
6
7 class AppCustomerRepository
8 {
9 private \PDO $pdo;
… +206 lines (ctrl+o to expand)

⏺ Write(src/app/Domain/App/Customer/Service/AppCustomerService.php)
⎿ Wrote 195 lines to src/app/Domain/App/Customer/Service/AppCustomerService.php
1 <?php
2
3 namespace App\Domain\App\Customer\Service;
4
5 use App\Common\Encryption;
6 use App\Common\Hash;
7 use App\Domain\App\Customer\Repository\AppCustomerRepository;
8
9 class AppCustomerService
10 {
… +185 lines (ctrl+o to expand)

⏺ Write(src/app/Domain/App/Customer/Controller/AppCustomerController.php)
⎿ Wrote 161 lines to src/app/Domain/App/Customer/Controller/AppCustomerController.php
1 <?php
2
3 namespace App\Domain\App\Customer\Controller;
4
5 use App\Core\Controller;
6 use App\Domain\App\Customer\Service\AppCustomerService;
7
8 /\*_
9 _ 앱 고객 DB API
10 \*
… +151 lines (ctrl+o to expand)

⏺ 이제 라우트를 추가합니다.

⏺ Update(src/app/Config/routes.php)
⎿ Added 20 lines
432  
 433 // 게시글 작성
434 $router->post('/api/app/board/post', [AppBoardController::class, 'createPost'], $appAuth);
      435 +                                                                                                                                          
      436 +// ============================================================                                                                           
      437 +// 앱 고객 DB API (/api/app/customers/)                                                                                                   
      438 +// ============================================================                                                                           
      439 +use App\Domain\App\Customer\Controller\AppCustomerController;                                                                             
      440 +                                                                                                                                          
      441 +// 정적 라우트 (동적 라우트보다 먼저 선언)                                                                                                
      442 +$router->get('/api/app/customers/stats', [AppCustomerController::class, 'stats'], $appAuth);                                        
      443 +$router->get('/api/app/customers/statuses', [AppCustomerController::class, 'statuses'], $appAuth);                                        
      444 +$router->get('/api/app/customers/progress', [AppCustomerController::class, 'progress'], $appAuth);                                        
      445 +                                                                                                                                          
      446 +// 고객 목록                                                                                                                              
      447 +$router->get('/api/app/customers', [AppCustomerController::class, 'list'], $appAuth);                                                     
      448 +                                                                                                                                          
      449 +// 고객 상세 / 상태변경 / 메모수정 / 상담이력                                                                                             
      450 +$router->get('/api/app/customers/{customerType}/{idx}', [AppCustomerController::class, 'detail'], $appAuth);                
      451 +$router->patch('/api/app/customers/{customerType}/{idx}/status',[AppCustomerController::class, 'updateStatus'], $appAuth);                
      452 +$router->patch('/api/app/customers/{customerType}/{idx}/memo', [AppCustomerController::class, 'updateMemo'], $appAuth);                
      453 +$router->get('/api/app/customers/{customerType}/{idx}/logs', [AppCustomerController::class, 'logs'], $appAuth);                
      454 +$router->post('/api/app/customers/{customerType}/{idx}/logs', [AppCustomerController::class, 'addLog'], $appAuth);

⏺ 완료됐습니다.

---

생성된 파일

src/app/Domain/App/Customer/  
 ├── Controller/AppCustomerController.php  
 ├── Service/AppCustomerService.php  
 └── Repository/AppCustomerRepository.php

엔드포인트 목록

┌────────┬────────────────────────────────────────────────────────────────────────┬────────────────┐  
 │ Method │ URL │ 설명 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ GET │ /api/app/customers/stats?year=2026&month=4 │ 월별 통계 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤
│ GET │ /api/app/customers/statuses │ 상담 상태 목록 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤
│ GET │ /api/app/customers/progress │ 오늘 진행 현황 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ GET │ /api/app/customers?customerType=office&keyword=김&consultStatus=상담중 │ 고객 목록 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ GET │ /api/app/customers/{type}/{idx} │ 고객 상세 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ PATCH │ /api/app/customers/{type}/{idx}/status │ 상담 상태 변경 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ PATCH │ /api/app/customers/{type}/{idx}/memo │ 메모 수정 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ GET │ /api/app/customers/{type}/{idx}/logs │ 상담 이력 조회 │  
 ├────────┼────────────────────────────────────────────────────────────────────────┼────────────────┤  
 │ POST │ /api/app/customers/{type}/{idx}/logs │ 상담 이력 추가 │  
 └────────┴────────────────────────────────────────────────────────────────────────┴────────────────┘

주요 처리 사항

- FP: assigned_account_idx = 본인 자동 필터링
- TL/BA/BM: assignedAccountIdx 쿼리파라미터로 조회
- 이름/연락처 검색: 암호화 정책 준수 (SHA-256 hash 정확검색)
- 개인정보: 복호화 후 반환 (name, phone, email, address)
- ⚠️ stats.meetingCount — 미팅 상태 기준값 확정 후 수정 필요  

