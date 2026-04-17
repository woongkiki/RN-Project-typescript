-- ============================================================
-- 인사이트 코어 영업점 RDS DDL
-- 각 영업점별 별도 RDS에 동일하게 적용
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- [B-환경설정] 조직
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_organizations` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `parent_idx` BIGINT UNSIGNED NULL,
    `leader_account_idx` BIGINT UNSIGNED NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `idx_organizations_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 업무담당자 카테고리
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_departments` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `idx_departments_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 영업점 설정
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_settings` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `setting_key` VARCHAR(100) NOT NULL,
    `setting_value` TEXT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_office_settings` (`office_idx`, `setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 직원평가 카테고리 (B플랜~)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_evaluation_categories` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `max_score` INT NOT NULL DEFAULT 100,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_eval_categories_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 직원평가 항목 (B플랜~)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_evaluation_items` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_idx` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `max_score` INT NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_eval_items_category` (`category_idx`),
    CONSTRAINT `fk_eval_items_category` FOREIGN KEY (`category_idx`) REFERENCES `tbl_evaluation_categories` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 직원평가 (B플랜~)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_evaluations` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `target_account_idx` BIGINT UNSIGNED NOT NULL,
    `evaluator_account_idx` BIGINT UNSIGNED NOT NULL,
    `period_start` DATE NOT NULL,
    `period_end` DATE NOT NULL,
    `total_score` INT NOT NULL DEFAULT 0,
    `grade` VARCHAR(10) NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_evaluations_office` (`office_idx`),
    KEY `idx_evaluations_target` (`target_account_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 직원평가 점수 (B플랜~)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_evaluation_scores` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `evaluation_idx` BIGINT UNSIGNED NOT NULL,
    `item_idx` BIGINT UNSIGNED NOT NULL,
    `score` INT NOT NULL,
    `comment` VARCHAR(500) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_eval_scores_evaluation` (`evaluation_idx`),
    CONSTRAINT `fk_eval_scores_evaluation` FOREIGN KEY (`evaluation_idx`) REFERENCES `tbl_evaluations` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 상품 분류
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_product_categories` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `idx_product_categories_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-환경설정] 상담 상태
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_consult_statuses` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `color` VARCHAR(10) NOT NULL DEFAULT '#999999',
    `is_system` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_consult_statuses_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-DB관리] A서버 분배 고객
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_customers` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_idx` BIGINT UNSIGNED NOT NULL COMMENT '메인DB tbl_customers.idx',
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name_enc` TEXT NOT NULL,
    `name_hash` VARCHAR(64) NOT NULL,
    `phone_enc` TEXT NOT NULL,
    `phone_hash` VARCHAR(64) NOT NULL,
    `email_enc` TEXT NULL,
    `email_hash` VARCHAR(64) NULL,
    `address_enc` TEXT NULL,
    `memo` TEXT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_name` VARCHAR(100) NOT NULL,
    `consult_status` VARCHAR(20) NOT NULL DEFAULT '상담대기',
    `assigned_account_idx` BIGINT UNSIGNED NULL,
    `distribute_at` DATETIME NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `idx_office_customers_office` (`office_idx`),
    KEY `idx_office_customers_assigned` (`assigned_account_idx`),
    KEY `idx_office_customers_phone_hash` (`phone_hash`),
    KEY `idx_office_customers_name_hash` (`name_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-DB관리] 자체 등록 고객
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_self_customers` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `name_enc` TEXT NOT NULL,
    `name_hash` VARCHAR(64) NOT NULL,
    `phone_enc` TEXT NOT NULL,
    `phone_hash` VARCHAR(64) NOT NULL,
    `email_enc` TEXT NULL,
    `email_hash` VARCHAR(64) NULL,
    `address_enc` TEXT NULL,
    `memo` TEXT NULL,
    `product_category_idx` BIGINT UNSIGNED NULL,
    `consult_status` VARCHAR(20) NOT NULL DEFAULT '상담대기',
    `distribute_status` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `assigned_account_idx` BIGINT UNSIGNED NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_self_customers_phone_hash` (`phone_hash`),
    KEY `idx_self_customers_office` (`office_idx`),
    KEY `idx_self_customers_assigned` (`assigned_account_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-DB관리] 상담 이력
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_consult_logs` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `customer_type` VARCHAR(10) NOT NULL COMMENT 'office/self',
    `customer_idx` BIGINT UNSIGNED NOT NULL,
    `account_idx` BIGINT UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `next_consult_date` DATE NULL,
    `memo` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_consult_logs_customer` (`customer_type`, `customer_idx`),
    KEY `idx_consult_logs_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-DB관리] 스케줄
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_schedules` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `account_idx` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NULL,
    `schedule_date` DATE NOT NULL,
    `schedule_time` TIME NULL,
    `customer_type` VARCHAR(10) NULL,
    `customer_idx` BIGINT UNSIGNED NULL,
    `addr1` VARCHAR(255) NOT NULL,
    `addr2` VARCHAR(255) NOT NULL,
    `is_important` VARCHAR(45) NOT NULL,
    `customer_idx` BIGINT UNSIGNED NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_schedules_office` (`office_idx`),
    KEY `idx_schedules_account` (`account_idx`),
    KEY `idx_schedules_date` (`schedule_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-CS관리] 영업점 AS 접수
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_as_requests` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `customer_type` VARCHAR(10) NOT NULL,
    `customer_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_name` VARCHAR(100) NOT NULL,
    `reason` TEXT NOT NULL,
    `account_idx` BIGINT UNSIGNED NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT '대기' COMMENT '대기/접수완료/처리완료',
    `core_cs_as_idx` BIGINT UNSIGNED NULL COMMENT '메인DB tbl_cs_as.idx',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_office_as_requests_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-CS관리] 영업점 AS 접수 첨부파일
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_as_files` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `as_request_idx` BIGINT UNSIGNED NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_name` VARCHAR(200) NOT NULL,
    `file_size` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_office_as_files` (`as_request_idx`),
    CONSTRAINT `fk_office_as_files` FOREIGN KEY (`as_request_idx`) REFERENCES `tbl_office_as_requests` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-게시판] 게시판 카테고리
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_board_categories` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `board_type` VARCHAR(20) NOT NULL COMMENT 'education/general/free/seminar',
    `name` VARCHAR(100) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `idx_board_categories_office_type` (`office_idx`, `board_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-게시판] 게시물
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_board_posts` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `board_type` VARCHAR(20) NOT NULL,
    `category_idx` BIGINT UNSIGNED NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `account_idx` BIGINT UNSIGNED NOT NULL,
    `view_count` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `idx_board_posts_office_type` (`office_idx`, `board_type`),
    KEY `fk_board_posts_category` (`category_idx`),
    CONSTRAINT `fk_board_posts_category` FOREIGN KEY (`category_idx`) REFERENCES `tbl_board_categories` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [B-게시판] 게시물 첨부파일
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_board_files` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_idx` BIGINT UNSIGNED NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_name` VARCHAR(200) NOT NULL,
    `file_size` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_board_files_post` (`post_idx`),
    CONSTRAINT `fk_board_files_post` FOREIGN KEY (`post_idx`) REFERENCES `tbl_board_posts` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 영업점 초기 데이터 (영업점 생성 시 자동 INSERT)
-- ============================================================

-- 상담 상태 기본값 (office_idx는 영업점 생성 시 대체)
-- INSERT INTO `tbl_consult_statuses` (`office_idx`, `name`, `color`, `is_system`, `sort_order`) VALUES
-- ({office_idx}, '상담대기', '#FFA500', 1, 1),
-- ({office_idx}, '상담중', '#007BFF', 0, 2),
-- ({office_idx}, '계약완료', '#28A745', 1, 3),
-- ({office_idx}, '부재', '#6C757D', 0, 4);

SET FOREIGN_KEY_CHECKS = 1;
