/*
 * @Author: julius 2024-05-15 
 * @LastEditTime: 2024-05-15 17:30
 * 雪橇管理系统数据库表结构
 */

-- 创建数据库
CREATE DATABASE IF NOT EXISTS skid_management_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE skid_management_system;

-- 雪橇主表
CREATE TABLE IF NOT EXISTS `skid_master` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `skid_id` VARCHAR(20) NOT NULL COMMENT '雪橇编号',
  `clean_status` ENUM('C', 'M', 'S') NOT NULL DEFAULT 'C' COMMENT '清洁度状态: C-清洁, M-中度, S-严重',
  `inspection_time` DATETIME NOT NULL COMMENT '检测时间',
  `online_status` ENUM('online', 'offline') NOT NULL DEFAULT 'offline' COMMENT '上下线状态: online-在线, offline-离线',
  `status_change_time` DATETIME NOT NULL COMMENT '上下线时间',
  `remarks` TEXT COMMENT '备注',
  `last_photo_url` VARCHAR(255) COMMENT '最新检测照片URL',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_skid_id` (`skid_id`),
  KEY `idx_clean_status` (`clean_status`),
  KEY `idx_online_status` (`online_status`),
  KEY `idx_inspection_time` (`inspection_time`),
  KEY `idx_status_change_time` (`status_change_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='雪橇主表';

-- 雪橇清洁度检测历史表（合并了照片信息）
CREATE TABLE IF NOT EXISTS `skid_inspection_history` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `skid_id` VARCHAR(20) NOT NULL COMMENT '雪橇编号',
  `inspection_time` DATETIME NOT NULL COMMENT '检测时间',
  `clean_status` ENUM('C', 'M', 'S') NOT NULL COMMENT '清洁度状态: C-清洁, M-中度, S-严重',
  `inspector` VARCHAR(50) NOT NULL COMMENT '检测人员',
  `inspection_method` VARCHAR(50) NOT NULL COMMENT '检测方式',
  `remarks` TEXT COMMENT '备注',
  `photos_json` JSON COMMENT '照片URL数组，JSON格式',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_skid_id` (`skid_id`),
  KEY `idx_inspection_time` (`inspection_time`),
  KEY `idx_clean_status` (`clean_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='雪橇清洁度检测历史表';

-- 雪橇上下线历史表
CREATE TABLE IF NOT EXISTS `skid_status_history` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `skid_id` VARCHAR(20) NOT NULL COMMENT '雪橇编号',
  `status_change_time` DATETIME NOT NULL COMMENT '状态变更时间',
  `online_status` ENUM('online', 'offline') NOT NULL COMMENT '上下线状态: online-在线, offline-离线',
  `operator` VARCHAR(50) NOT NULL COMMENT '操作人员',
  `duration` VARCHAR(50) COMMENT '持续时间',
  `reason` TEXT NOT NULL COMMENT '原因',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_skid_id` (`skid_id`),
  KEY `idx_status_change_time` (`status_change_time`),
  KEY `idx_online_status` (`online_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='雪橇上下线历史表';

-- 外键约束
ALTER TABLE `skid_inspection_history` 
ADD CONSTRAINT `fk_inspection_skid` FOREIGN KEY (`skid_id`) REFERENCES `skid_master` (`skid_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `skid_status_history` 
ADD CONSTRAINT `fk_status_skid` FOREIGN KEY (`skid_id`) REFERENCES `skid_master` (`skid_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 初始化雪橇主表数据
INSERT INTO `skid_master` (`skid_id`, `clean_status`, `inspection_time`, `online_status`, `status_change_time`, `remarks`, `last_photo_url`) VALUES
('SK001', 'C', '2024-05-15 08:30:25', 'online', '2024-05-15 08:30:00', '正常运行', 'https://img1.baidu.com/it/u=1855002638,3583285371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'),
('SK002', 'M', '2024-05-15 09:15:32', 'online', '2024-05-14 14:22:10', '需要定期清洁', 'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'),
('SK003', 'S', '2024-05-15 07:45:18', 'offline', '2024-05-15 08:00:45', '需要立即清洁', 'https://img2.baidu.com/it/u=3017979151,3706693730&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'),
('SK004', 'C', '2024-05-14 16:20:07', 'online', '2024-05-14 16:25:30', NULL, NULL),
('SK005', 'M', '2024-05-15 10:05:22', 'online', '2024-05-13 09:30:15', '计划下周清洁', 'https://img0.baidu.com/it/u=2180889471,3043938102&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400'),
('SK006', 'C', '2024-05-14 14:50:39', 'online', '2024-05-14 08:15:00', NULL, NULL),
('SK007', 'S', '2024-05-15 11:25:10', 'offline', '2024-05-15 11:30:25', '紧急维护中', 'https://img1.baidu.com/it/u=3858126549,207250658&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427');

-- 初始化清洁度检测历史数据（包含照片信息）
INSERT INTO `skid_inspection_history` (`skid_id`, `inspection_time`, `clean_status`, `inspector`, `inspection_method`, `remarks`, `photos_json`) VALUES
('SK001', '2024-05-15 08:30:25', 'C', '张三', '自动检测', '例行检查，未发现异常', JSON_ARRAY(
  'https://img1.baidu.com/it/u=1855002638,3583285371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
  'https://img0.baidu.com/it/u=2625374591,2158267257&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  'https://img2.baidu.com/it/u=645649465,805211113&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'
)),
('SK002', '2024-05-15 09:15:32', 'M', '李四', '人工检测', '需要定期清洁', JSON_ARRAY(
  'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'
)),
('SK002', '2024-05-14 09:15:32', 'C', '李四', '人工检测', '清洁后复检，状态良好', JSON_ARRAY(
  'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313',
  'https://img0.baidu.com/it/u=3336432945,2423654933&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
)),
('SK003', '2024-05-15 07:45:18', 'S', '王五', '自动检测', '需要立即清洁，发现大量灰尘附着', JSON_ARRAY(
  'https://img1.baidu.com/it/u=3858126549,207250658&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427',
  'https://img2.baidu.com/it/u=3866535257,1473421208&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'
)),
('SK003', '2024-05-13 15:45:18', 'M', '张三', '自动检测', '发现部分灰尘积累，建议定期清洁', JSON_ARRAY(
  'https://img0.baidu.com/it/u=2180889471,3043938102&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400'
)),
('SK004', '2024-05-14 16:20:07', 'C', '李四', '自动检测', '例行检查，状态良好', NULL),
('SK005', '2024-05-15 10:05:22', 'M', '王五', '自动检测', '需要定期清洁，有轻微积灰', NULL),
('SK005', '2024-05-12 10:20:07', 'M', '王五', '自动检测', '需要定期清洁，有轻微积灰', NULL),
('SK006', '2024-05-14 14:50:39', 'C', '张三', '人工检测', '清洁后复检，状态良好', NULL),
('SK007', '2024-05-15 11:25:10', 'S', '李四', '人工检测', '发现污垢严重积累，影响运行效率', JSON_ARRAY(
  'https://img2.baidu.com/it/u=3017979151,3706693730&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  'https://img2.baidu.com/it/u=2202075425,1476416926&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400',
  'https://img0.baidu.com/it/u=2626435803,1017157069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
  'https://img0.baidu.com/it/u=319771886,2559112920&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
)),
('SK007', '2024-05-11 14:05:22', 'S', '李四', '人工检测', '发现污垢严重积累，影响运行效率', JSON_ARRAY(
  'https://img2.baidu.com/it/u=3017979151,3706693730&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
)),
('SK007', '2024-05-10 11:50:39', 'S', '王五', '自动检测', '需要立即清洁，发现大量灰尘附着', JSON_ARRAY(
  'https://img1.baidu.com/it/u=3858126549,207250658&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427',
  'https://img2.baidu.com/it/u=3866535257,1473421208&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'
)),
('SK007', '2024-05-09 16:25:10', 'C', '张三', '人工检测', '清洁后复检，状态良好', JSON_ARRAY(
  'https://img2.baidu.com/it/u=1101560220,695897885&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
));

-- 初始化上下线历史数据
INSERT INTO `skid_status_history` (`skid_id`, `status_change_time`, `online_status`, `operator`, `duration`, `reason`) VALUES
('SK001', '2024-05-15 08:30:00', 'online', '张三', '16小时25分', '例行上线'),
('SK001', '2024-05-14 16:05:00', 'offline', '李四', '8小时10分', '设备检修'),
('SK002', '2024-05-14 14:22:10', 'online', '王五', '32小时30分', '恢复生产'),
('SK002', '2024-05-12 23:25:00', 'offline', '张三', '4小时35分', '设备清洗'),
('SK003', '2024-05-15 08:00:45', 'offline', '李四', '48小时15分', '清洁维护'),
('SK003', '2024-05-12 18:50:00', 'online', '李四', '48小时15分', '例行上线'),
('SK004', '2024-05-14 16:25:30', 'online', '王五', '72小时20分', '恢复生产'),
('SK004', '2024-05-10 18:35:00', 'offline', '王五', '2小时45分', '软件更新'),
('SK005', '2024-05-13 09:30:15', 'online', '张三', '16小时25分', '例行上线'),
('SK005', '2024-05-12 18:50:00', 'offline', '李四', '8小时10分', '设备检修'),
('SK006', '2024-05-14 08:15:00', 'online', '王五', '32小时30分', '恢复生产'),
('SK006', '2024-05-12 23:25:00', 'offline', '张三', '4小时35分', '设备清洗'),
('SK007', '2024-05-15 11:30:25', 'offline', '李四', '48小时15分', '紧急维护中'),
('SK007', '2024-05-10 15:50:00', 'online', '张三', '72小时20分', '恢复生产'); 