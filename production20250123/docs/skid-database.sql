-- 雪橇管理系统数据库设计
-- @Author: julius 2024-05-15 
-- @LastEditTime: 2024-05-15 19:00

-- 创建数据库
CREATE DATABASE IF NOT EXISTS skid_management_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE skid_management_system;

-- 雪橇状态表
CREATE TABLE IF NOT EXISTS skid_info (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '自增主键',
  skid_id VARCHAR(20) NOT NULL UNIQUE COMMENT '雪橇编号',
  clean_status ENUM('C', 'M', 'S') NOT NULL DEFAULT 'C' COMMENT '清洁度状态：清洁(C)、中度(M)、严重(S)',
  inspection_time DATETIME NOT NULL COMMENT '最新检测时间',
  online_status ENUM('online', 'offline', 'cleaning') NOT NULL DEFAULT 'offline' COMMENT '上下线状态：在线(online)、离线(offline)、清洗中(cleaning)',
  status_change_time DATETIME NOT NULL COMMENT '最新上下线状态变更时间',
  remarks TEXT COMMENT '备注',
  last_photo VARCHAR(255) COMMENT '最新检测照片URL',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_skid_id (skid_id),
  INDEX idx_clean_status (clean_status),
  INDEX idx_online_status (online_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='雪橇基本信息表';

-- 雪橇清洁度检测历史记录表
CREATE TABLE IF NOT EXISTS skid_inspection_history (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '自增主键',
  skid_id VARCHAR(20) NOT NULL COMMENT '雪橇编号',
  inspection_time DATETIME NOT NULL COMMENT '检测时间',
  clean_status ENUM('C', 'M', 'S') NOT NULL COMMENT '清洁度状态：清洁(C)、中度(M)、严重(S)',
  inspector VARCHAR(50) NOT NULL COMMENT '检测人员',
  inspection_method VARCHAR(50) NOT NULL COMMENT '检测方式：自动检测、人工检测等',
  photo_url VARCHAR(255) COMMENT '检测照片URL',
  remarks TEXT COMMENT '备注',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_skid_id (skid_id),
  INDEX idx_inspection_time (inspection_time),
  INDEX idx_clean_status (clean_status),
  FOREIGN KEY (skid_id) REFERENCES skid_info(skid_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='雪橇清洁度检测历史记录表';

-- 雪橇上下线历史表
CREATE TABLE IF NOT EXISTS skid_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '自增主键',
  skid_id VARCHAR(20) NOT NULL COMMENT '雪橇编号',
  status_change_time DATETIME NOT NULL COMMENT '状态变更时间',
  online_status ENUM('online', 'offline', 'cleaning') NOT NULL COMMENT '上下线状态：在线(online)、离线(offline)、清洗中(cleaning)',
  operator VARCHAR(50) NOT NULL COMMENT '操作人员',
  duration VARCHAR(50) COMMENT '持续时间（如：16小时25分）',
  reason TEXT COMMENT '原因',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_skid_id (skid_id),
  INDEX idx_status_change_time (status_change_time),
  INDEX idx_online_status (online_status),
  FOREIGN KEY (skid_id) REFERENCES skid_info(skid_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='雪橇上下线历史表';

-- 插入示例数据

-- 雪橇基本信息
INSERT INTO skid_info (skid_id, clean_status, inspection_time, online_status, status_change_time, remarks, last_photo) VALUES
('SK001', 'C', '2024-05-15 08:30:25', 'online', '2024-05-15 08:30:00', '正常运行', 'https://img1.baidu.com/it/u=1855002638,3583285371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'),
('SK002', 'M', '2024-05-15 09:15:32', 'online', '2024-05-14 14:22:10', '需要定期清洁', 'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'),
('SK003', 'S', '2024-05-15 07:45:18', 'offline', '2024-05-15 08:00:45', '需要立即清洁', 'https://img2.baidu.com/it/u=3017979151,3706693730&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'),
('SK004', 'C', '2024-05-14 16:20:07', 'online', '2024-05-14 16:25:30', NULL, NULL),
('SK005', 'M', '2024-05-15 10:05:22', 'online', '2024-05-13 09:30:15', '计划下周清洁', 'https://img0.baidu.com/it/u=2180889471,3043938102&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400'),
('SK006', 'C', '2024-05-14 14:50:39', 'online', '2024-05-14 08:15:00', NULL, NULL),
('SK007', 'S', '2024-05-15 11:25:10', 'cleaning', '2024-05-15 11:30:25', '正在清洗中', 'https://img1.baidu.com/it/u=3858126549,207250658&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427'),
('SK008', 'S', '2024-05-15 09:30:12', 'cleaning', '2024-05-15 10:00:00', '进行例行清洗', NULL);

-- 雪橇清洁度检测历史
INSERT INTO skid_inspection_history (skid_id, inspection_time, clean_status, inspector, inspection_method, photo_url, remarks) VALUES
('SK001', '2024-05-15 08:30:25', 'C', '张三', '自动检测', 'https://img1.baidu.com/it/u=1855002638,3583285371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333', '例行检查，未发现异常'),
('SK001', '2024-05-14 09:15:32', 'C', '李四', '人工检测', 'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313', '清洁后复检，状态良好'),
('SK001', '2024-05-13 15:45:18', 'M', '张三', '自动检测', 'https://img0.baidu.com/it/u=2180889471,3043938102&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400', '发现部分灰尘积累，建议定期清洁'),
('SK001', '2024-05-12 10:20:07', 'M', '王五', '自动检测', NULL, '需要定期清洁，有轻微积灰'),
('SK001', '2024-05-11 14:05:22', 'S', '李四', '人工检测', 'https://img2.baidu.com/it/u=3017979151,3706693730&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500', '发现污垢严重积累，影响运行效率'),
('SK001', '2024-05-10 11:50:39', 'S', '王五', '自动检测', 'https://img1.baidu.com/it/u=3858126549,207250658&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427', '需要立即清洁，发现大量灰尘附着'),
('SK001', '2024-05-09 16:25:10', 'C', '张三', '人工检测', 'https://img2.baidu.com/it/u=1101560220,695897885&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500', '清洁后复检，状态良好'),
('SK002', '2024-05-15 09:15:32', 'M', '李四', '自动检测', 'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313', '轻微积灰'),
('SK003', '2024-05-15 07:45:18', 'S', '王五', '人工检测', 'https://img2.baidu.com/it/u=3017979151,3706693730&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500', '灰尘严重'),
('SK004', '2024-05-14 16:20:07', 'C', '张三', '自动检测', NULL, '状态良好'),
('SK005', '2024-05-15 10:05:22', 'M', '李四', '人工检测', 'https://img0.baidu.com/it/u=2180889471,3043938102&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=400', '轻微积灰，需要清洁'),
('SK006', '2024-05-14 14:50:39', 'C', '王五', '自动检测', NULL, '状态良好'),
('SK007', '2024-05-15 11:25:10', 'S', '张三', '人工检测', 'https://img1.baidu.com/it/u=3858126549,207250658&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427', '严重积灰，需要立即清洁'),
('SK008', '2024-05-15 09:30:12', 'S', '李四', '人工检测', NULL, '污垢严重，准备清洗');

-- 雪橇上下线历史
INSERT INTO skid_status_history (skid_id, status_change_time, online_status, operator, duration, reason) VALUES
('SK001', '2024-05-15 08:30:00', 'online', '张三', '16小时25分', '例行上线'),
('SK001', '2024-05-14 16:05:00', 'offline', '李四', '8小时10分', '设备检修'),
('SK001', '2024-05-14 07:55:00', 'online', '王五', '32小时30分', '恢复生产'),
('SK001', '2024-05-12 23:25:00', 'offline', '张三', '4小时35分', '设备清洗'),
('SK001', '2024-05-12 18:50:00', 'online', '李四', '48小时15分', '例行上线'),
('SK001', '2024-05-10 18:35:00', 'offline', '王五', '2小时45分', '软件更新'),
('SK001', '2024-05-10 15:50:00', 'online', '张三', '72小时20分', '恢复生产'),
('SK002', '2024-05-14 14:22:10', 'online', '李四', '进行中...', '例行上线'),
('SK003', '2024-05-15 08:00:45', 'offline', '王五', '3小时15分', '设备检修'),
('SK004', '2024-05-14 16:25:30', 'online', '张三', '进行中...', '恢复生产'),
('SK005', '2024-05-13 09:30:15', 'online', '李四', '进行中...', '例行上线'),
('SK006', '2024-05-14 08:15:00', 'online', '王五', '进行中...', '恢复生产'),
('SK007', '2024-05-15 11:30:25', 'cleaning', '张三', '进行中...', '进行清洗作业'),
('SK007', '2024-05-15 09:25:00', 'offline', '张三', '2小时5分', '准备清洗'),
('SK008', '2024-05-15 10:00:00', 'cleaning', '李四', '进行中...', '定期清洗维护'),
('SK008', '2024-05-14 15:45:20', 'offline', '王五', '18小时15分', '待机');

-- 创建视图：查看雪橇当前状态及其最近一次清洁度检测信息
CREATE OR REPLACE VIEW v_skid_current_status AS
SELECT 
  s.skid_id,
  s.clean_status,
  s.inspection_time,
  s.online_status,
  s.status_change_time,
  s.remarks,
  s.last_photo,
  ih.inspector AS last_inspector,
  ih.inspection_method AS last_inspection_method
FROM 
  skid_info s
LEFT JOIN 
  skid_inspection_history ih ON s.skid_id = ih.skid_id AND s.inspection_time = ih.inspection_time;

-- 查询示例

-- 1. 查询所有雪橇当前状态
-- SELECT * FROM v_skid_current_status;

-- 2. 查询清洁度为严重(S)的雪橇
-- SELECT * FROM v_skid_current_status WHERE clean_status = 'S';

-- 3. 查询在线状态的雪橇
-- SELECT * FROM v_skid_current_status WHERE online_status = 'online';

-- 4. 查询特定雪橇的清洁度检测历史记录
-- SELECT * FROM skid_inspection_history WHERE skid_id = 'SK001' ORDER BY inspection_time DESC;

-- 5. 查询特定雪橇的上下线历史记录
-- SELECT * FROM skid_status_history WHERE skid_id = 'SK001' ORDER BY status_change_time DESC;

-- 6. 查询最近一周内检测过的雪橇
-- SELECT DISTINCT skid_id FROM skid_inspection_history WHERE inspection_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK);

-- 7. 查询上线时间超过24小时的雪橇
-- SELECT * FROM v_skid_current_status WHERE online_status = 'online' AND status_change_time <= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- 8. 查询正在清洗中的雪橇
-- SELECT * FROM v_skid_current_status WHERE online_status = 'cleaning'; 