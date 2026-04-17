-- ============================================================
-- 인사이트코어 메인 DB (mauem) DDL
-- 전체 도메인 통합 스키마
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- [인증] 관리자 계정
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_admins` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `login_id` VARCHAR(20) NOT NULL COMMENT '로그인 아이디 (영문/숫자 4~20자)',
    `email` VARCHAR(150) NULL COMMENT '연락용 이메일',
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(10) NOT NULL DEFAULT 'ADM' COMMENT 'SYS/SUP/ADM/EMP',
    `phone` VARCHAR(20) NULL,
    `login_fail_count` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `locked_at` DATETIME NULL,
    `last_login_at` DATETIME NULL,
    `last_login_ip` VARCHAR(45) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '1:활성, 0:비활성',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_admins_login_id` (`login_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [인증] 관리자 로그인 로그
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_admin_login_logs` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `admin_idx` BIGINT UNSIGNED NOT NULL,
    `action` VARCHAR(20) NOT NULL,
    `ip` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(500) NULL,
    `result` VARCHAR(10) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_admin_login_logs_admin` (`admin_idx`),
    CONSTRAINT `fk_admin_login_logs_admin` FOREIGN KEY (`admin_idx`) REFERENCES `tbl_admins` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 기본설정
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_settings` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(100) NOT NULL,
    `setting_value` TEXT NULL,
    `description` VARCHAR(200) NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_settings_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 차단 IP
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_blocked_ips` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ip_address` VARCHAR(45) NOT NULL,
    `admin_idx` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_blocked_ips_ip` (`ip_address`),
    KEY `fk_blocked_ips_admin` (`admin_idx`),
    CONSTRAINT `fk_blocked_ips_admin` FOREIGN KEY (`admin_idx`) REFERENCES `tbl_admins` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 약관
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_terms` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL COMMENT '개인정보처리방침/이용약관',
    `title` VARCHAR(200) NOT NULL,
    `version` VARCHAR(20) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '1:활성, 0:비활성',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 플랜
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_plans` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(10) NOT NULL COMMENT 'A/B/C',
    `name` VARCHAR(50) NOT NULL,
    `monthly_price` INT NOT NULL DEFAULT 0,
    `description` VARCHAR(500) NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_plans_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 플랜별 메뉴
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_plan_menus` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `plan_idx` BIGINT UNSIGNED NOT NULL,
    `menu_code` VARCHAR(50) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_plan_menus_plan` (`plan_idx`),
    CONSTRAINT `fk_plan_menus_plan` FOREIGN KEY (`plan_idx`) REFERENCES `tbl_plans` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 인원 과금 구간
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_pricing_tiers` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `min_count` INT NOT NULL,
    `max_count` INT NOT NULL,
    `unit_price` INT NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 시스템 이용료
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_system_fees` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `setup_fee` INT NOT NULL DEFAULT 0,
    `monthly_fee` INT NOT NULL DEFAULT 0,
    `extra_person_fee` INT NOT NULL DEFAULT 0,
    `free_person_count` INT NOT NULL DEFAULT 30,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] DB 등급
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_db_grades` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` INT NOT NULL DEFAULT 0,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 공지사항
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_notices` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `admin_idx` BIGINT UNSIGNED NOT NULL,
    `view_count` INT NOT NULL DEFAULT 0,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `fk_notices_admin` (`admin_idx`),
    CONSTRAINT `fk_notices_admin` FOREIGN KEY (`admin_idx`) REFERENCES `tbl_admins` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-환경설정] 공지사항 첨부파일
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_notice_files` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `notice_idx` BIGINT UNSIGNED NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_name` VARCHAR(200) NOT NULL,
    `file_size` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_notice_files_notice` (`notice_idx`),
    CONSTRAINT `fk_notice_files_notice` FOREIGN KEY (`notice_idx`) REFERENCES `tbl_notices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-영업점관리] 영업점
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_offices` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `ceo_name` VARCHAR(100) NOT NULL,
    `business_number` VARCHAR(20) NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(150) NULL,
    `address` VARCHAR(500) NULL,
    `rds_host` VARCHAR(200) NOT NULL,
    `rds_port` INT NOT NULL DEFAULT 3306,
    `rds_user` VARCHAR(100) NOT NULL,
    `rds_password` VARCHAR(500) NOT NULL COMMENT '암호화 저장',
    `rds_database` VARCHAR(100) NOT NULL,
    `s3_bucket` VARCHAR(200) NULL,
    `s3_region` VARCHAR(50) NULL,
    `s3_access_key` VARCHAR(500) NULL COMMENT '암호화 저장',
    `s3_secret_key` VARCHAR(500) NULL COMMENT '암호화 저장',
    `plan_idx` BIGINT UNSIGNED NOT NULL,
    `max_accounts` INT NOT NULL DEFAULT 30,
    `contract_start` DATE NOT NULL,
    `contract_end` DATE NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    KEY `fk_offices_plan` (`plan_idx`),
    CONSTRAINT `fk_offices_plan` FOREIGN KEY (`plan_idx`) REFERENCES `tbl_plans` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-영업점관리] 영업점 DB 설정
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_db_settings` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `max_quantity` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_office_db_settings_office` (`office_idx`),
    KEY `fk_office_db_settings_grade` (`db_grade_idx`),
    CONSTRAINT `fk_office_db_settings_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`),
    CONSTRAINT `fk_office_db_settings_grade` FOREIGN KEY (`db_grade_idx`) REFERENCES `tbl_db_grades` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [인증] 영업점 계정
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_accounts` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `login_id` VARCHAR(20) NOT NULL COMMENT '로그인 아이디 (영문/숫자 4~20자)',
    `email` VARCHAR(150) NULL COMMENT '연락용 이메일',
    `password` VARCHAR(255) NOT NULL,
    `name_enc` TEXT NOT NULL COMMENT 'AES-256-GCM 암호화',
    `name_hash` VARCHAR(64) NOT NULL COMMENT 'SHA-256 해시',
    `phone_enc` TEXT NULL,
    `phone_hash` VARCHAR(64) NULL,
    `role` VARCHAR(10) NOT NULL DEFAULT 'FP' COMMENT 'BA/BM/TL/FP',
    `dept_idx` INT NULL COMMENT '영업점RDS tbl_departments.idx',
    `org_idx` INT NULL COMMENT '영업점RDS tbl_organizations.idx',
    `login_fail_count` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `locked_at` DATETIME NULL,
    `last_login_at` DATETIME NULL,
    `last_login_ip` VARCHAR(45) NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_office_accounts_login_id` (`login_id`),
    KEY `fk_office_accounts_office` (`office_idx`),
    KEY `idx_office_accounts_name_hash` (`name_hash`),
    CONSTRAINT `fk_office_accounts_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [인증] 영업점 로그인 로그
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_office_login_logs` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `account_idx` BIGINT UNSIGNED NOT NULL,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `action` VARCHAR(20) NOT NULL,
    `ip` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(500) NULL,
    `result` VARCHAR(10) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_office_login_logs_account` (`account_idx`),
    KEY `fk_office_login_logs_office` (`office_idx`),
    CONSTRAINT `fk_office_login_logs_account` FOREIGN KEY (`account_idx`) REFERENCES `tbl_office_accounts` (`idx`),
    CONSTRAINT `fk_office_login_logs_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [알림] 알림
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_notifications` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `target_type` VARCHAR(20) NOT NULL COMMENT 'admin/office_account',
    `target_idx` BIGINT UNSIGNED NOT NULL,
    `office_idx` BIGINT UNSIGNED NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NULL,
    `link_url` VARCHAR(500) NULL,
    `is_read` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `read_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_notifications_target` (`target_type`, `target_idx`, `is_read`),
    KEY `idx_notifications_office` (`office_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-DB관리] 고객 DB
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_customers` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name_enc` TEXT NOT NULL COMMENT 'AES-256-GCM',
    `name_hash` VARCHAR(64) NOT NULL,
    `phone_enc` TEXT NOT NULL,
    `phone_hash` VARCHAR(64) NOT NULL,
    `email_enc` TEXT NULL,
    `email_hash` VARCHAR(64) NULL,
    `address_enc` TEXT NULL,
    `memo` TEXT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `distribute_status` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0:미분배, 1:분배완료',
    `distribute_office_idx` BIGINT UNSIGNED NULL,
    `distribute_at` DATETIME NULL,
    `admin_idx` BIGINT UNSIGNED NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`idx`),
    UNIQUE KEY `uk_customers_phone_hash` (`phone_hash`),
    KEY `idx_customers_name_hash` (`name_hash`),
    KEY `fk_customers_grade` (`db_grade_idx`),
    KEY `fk_customers_office` (`distribute_office_idx`),
    KEY `fk_customers_admin` (`admin_idx`),
    CONSTRAINT `fk_customers_grade` FOREIGN KEY (`db_grade_idx`) REFERENCES `tbl_db_grades` (`idx`),
    CONSTRAINT `fk_customers_office` FOREIGN KEY (`distribute_office_idx`) REFERENCES `tbl_offices` (`idx`),
    CONSTRAINT `fk_customers_admin` FOREIGN KEY (`admin_idx`) REFERENCES `tbl_admins` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-DB관리] 고객 분배 로그
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_customer_distribute_logs` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_idx` BIGINT UNSIGNED NOT NULL,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `admin_idx` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cdl_customer` (`customer_idx`),
    KEY `fk_cdl_office` (`office_idx`),
    CONSTRAINT `fk_cdl_customer` FOREIGN KEY (`customer_idx`) REFERENCES `tbl_customers` (`idx`),
    CONSTRAINT `fk_cdl_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-CS관리] AS 접수
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_cs_as` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `customer_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `reason` TEXT NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT '대기' COMMENT '대기/승인/거절',
    `processed_by` BIGINT UNSIGNED NULL,
    `processed_at` DATETIME NULL,
    `process_reason` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cs_as_office` (`office_idx`),
    KEY `fk_cs_as_customer` (`customer_idx`),
    CONSTRAINT `fk_cs_as_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`),
    CONSTRAINT `fk_cs_as_customer` FOREIGN KEY (`customer_idx`) REFERENCES `tbl_customers` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-CS관리] AS 접수 첨부파일
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_cs_as_files` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cs_as_idx` BIGINT UNSIGNED NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_name` VARCHAR(200) NOT NULL,
    `file_size` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cs_as_files` (`cs_as_idx`),
    CONSTRAINT `fk_cs_as_files` FOREIGN KEY (`cs_as_idx`) REFERENCES `tbl_cs_as` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-CS관리] DB 요청 (가망고객)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_cs_db_requests` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `request_quantity` INT NOT NULL,
    `reason` TEXT NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT '대기',
    `processed_by` BIGINT UNSIGNED NULL,
    `processed_at` DATETIME NULL,
    `process_reason` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cs_db_requests_office` (`office_idx`),
    CONSTRAINT `fk_cs_db_requests_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-CS관리] 계정수 변경 요청
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_cs_account_requests` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `current_count` INT NOT NULL,
    `request_count` INT NOT NULL,
    `reason` TEXT NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT '대기',
    `processed_by` BIGINT UNSIGNED NULL,
    `processed_at` DATETIME NULL,
    `process_reason` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cs_account_requests_office` (`office_idx`),
    CONSTRAINT `fk_cs_account_requests_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-CS관리] 1:1 문의
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_cs_inquiries` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `account_idx` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT '대기' COMMENT '대기/완료',
    `reply_content` TEXT NULL,
    `reply_by` BIGINT UNSIGNED NULL,
    `reply_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cs_inquiries_office` (`office_idx`),
    CONSTRAINT `fk_cs_inquiries_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-CS관리] 1:1 문의 첨부파일
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_cs_inquiry_files` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inquiry_idx` BIGINT UNSIGNED NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_name` VARCHAR(200) NOT NULL,
    `file_size` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_cs_inquiry_files` (`inquiry_idx`),
    CONSTRAINT `fk_cs_inquiry_files` FOREIGN KEY (`inquiry_idx`) REFERENCES `tbl_cs_inquiries` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-정산관리] 정산
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_settlements` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `office_idx` BIGINT UNSIGNED NOT NULL,
    `settlement_month` VARCHAR(7) NOT NULL COMMENT 'YYYY-MM',
    `type` VARCHAR(20) NOT NULL COMMENT 'db_sales/system_fee/total',
    `total_amount` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(10) NOT NULL DEFAULT '미확정' COMMENT '미확정/확정',
    `confirmed_by` BIGINT UNSIGNED NULL,
    `confirmed_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_settlements_office` (`office_idx`),
    KEY `idx_settlements_month` (`settlement_month`),
    CONSTRAINT `fk_settlements_office` FOREIGN KEY (`office_idx`) REFERENCES `tbl_offices` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-정산관리] DB 판매 정산 상세
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_settlement_db_details` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `settlement_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_idx` BIGINT UNSIGNED NOT NULL,
    `db_grade_name` VARCHAR(100) NOT NULL COMMENT '스냅샷',
    `unit_price` INT NOT NULL,
    `distribute_count` INT NOT NULL DEFAULT 0,
    `as_exclude_count` INT NOT NULL DEFAULT 0,
    `net_count` INT NOT NULL DEFAULT 0,
    `amount` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_sdd_settlement` (`settlement_idx`),
    CONSTRAINT `fk_sdd_settlement` FOREIGN KEY (`settlement_idx`) REFERENCES `tbl_settlements` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-정산관리] 시스템 이용료 정산 상세
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_settlement_fee_details` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `settlement_idx` BIGINT UNSIGNED NOT NULL,
    `setup_fee` INT NOT NULL DEFAULT 0,
    `monthly_fee` INT NOT NULL DEFAULT 0,
    `total_persons` INT NOT NULL DEFAULT 0,
    `free_persons` INT NOT NULL DEFAULT 0,
    `extra_persons` INT NOT NULL DEFAULT 0,
    `extra_person_fee` INT NOT NULL DEFAULT 0,
    `total_amount` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_sfd_settlement` (`settlement_idx`),
    CONSTRAINT `fk_sfd_settlement` FOREIGN KEY (`settlement_idx`) REFERENCES `tbl_settlements` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [A-정산관리] 이용료 과금 구간 스냅샷
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_settlement_fee_tiers` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `fee_detail_idx` BIGINT UNSIGNED NOT NULL,
    `min_count` INT NOT NULL,
    `max_count` INT NOT NULL,
    `person_count` INT NOT NULL,
    `unit_price` INT NOT NULL,
    `amount` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `fk_sft_detail` (`fee_detail_idx`),
    CONSTRAINT `fk_sft_detail` FOREIGN KEY (`fee_detail_idx`) REFERENCES `tbl_settlement_fee_details` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [공통] 액션 로그
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_action_logs` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_type` VARCHAR(10) NOT NULL COMMENT 'admin/office_account',
    `user_idx` BIGINT UNSIGNED NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `target_type` VARCHAR(50) NOT NULL,
    `target_idx` BIGINT UNSIGNED NOT NULL,
    `detail` TEXT NULL,
    `ip` VARCHAR(45) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_action_logs_user` (`user_type`, `user_idx`),
    KEY `idx_action_logs_target` (`target_type`, `target_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- [공통] 개인정보 조회 로그
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_personal_data_logs` (
    `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_type` VARCHAR(10) NOT NULL,
    `user_idx` BIGINT UNSIGNED NOT NULL,
    `target_type` VARCHAR(50) NOT NULL,
    `target_idx` BIGINT UNSIGNED NOT NULL,
    `ip` VARCHAR(45) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idx`),
    KEY `idx_pdl_user` (`user_type`, `user_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 초기 데이터
-- ============================================================

-- 기본 설정값
INSERT INTO `tbl_settings` (`setting_key`, `setting_value`, `description`) VALUES
('service_name', 'maeum', '서비스명'),
('phone', '', '대표전화'),
('email', '', '대표이메일'),
('address', '', '주소'),
('business_number', '', '사업자등록번호'),
('db_auto_delete', '0', 'DB 자동삭제 여부'),
('db_auto_delete_days', '365', '자동삭제 기간(일)'),
('as_enabled', '1', 'AS 신청 기능 사용 여부');

-- 기본 플랜
INSERT INTO `tbl_plans` (`code`, `name`, `monthly_price`, `sort_order`, `status`) VALUES
('A', 'A플랜', 0, 1, 1),
('B', 'B플랜', 0, 2, 1),
('C', 'C플랜', 0, 3, 1);

-- 기본 과금 구간
INSERT INTO `tbl_pricing_tiers` (`min_count`, `max_count`, `unit_price`, `sort_order`) VALUES
(31, 100, 20000, 1),
(101, 300, 15000, 2);

-- 시스템 이용료 초기값
INSERT INTO `tbl_system_fees` (`setup_fee`, `monthly_fee`, `extra_person_fee`, `free_person_count`) VALUES
(0, 0, 0, 30);

-- 기본 관리자 계정
INSERT INTO `tbl_admins` (`login_id`, `password`, `name`, `role`, `status`) VALUES
('admincnj', '$2y$10$jKAKRsVtPoDfx.flXjQnJO3BRVeBgm/QArA7lZyph02gsJSyM28ra', '시스템최고관리자', 'SYS', 1),
('admin', '$2y$10$jKAKRsVtPoDfx.flXjQnJO3BRVeBgm/QArA7lZyph02gsJSyM28ra', '일반최고관리자', 'SUP', 1);

SET FOREIGN_KEY_CHECKS = 1;
