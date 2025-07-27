/*
 * @Author: julius 2024-05-15 
 * @LastEditTime: 2024-05-15 17:50
 * 雪橇管理系统数据库视图和触发器
 */

USE skid_management_system;

-- 视图 - 雪橇清洁状态统计
CREATE OR REPLACE VIEW `v_skid_clean_status_stats` AS
SELECT 
    clean_status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM skid_master), 2) AS percentage
FROM skid_master
GROUP BY clean_status;

-- 视图 - 雪橇上下线状态统计
CREATE OR REPLACE VIEW `v_skid_online_status_stats` AS
SELECT 
    online_status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM skid_master), 2) AS percentage
FROM skid_master
GROUP BY online_status;

-- 视图 - 雪橇近期清洁度检测统计（按天）
CREATE OR REPLACE VIEW `v_skid_inspection_daily_stats` AS
SELECT 
    DATE(inspection_time) AS inspection_date,
    COUNT(*) AS total_count,
    SUM(CASE WHEN clean_status = 'C' THEN 1 ELSE 0 END) AS clean_count,
    SUM(CASE WHEN clean_status = 'M' THEN 1 ELSE 0 END) AS medium_count,
    SUM(CASE WHEN clean_status = 'S' THEN 1 ELSE 0 END) AS severe_count,
    ROUND(SUM(CASE WHEN clean_status = 'C' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS clean_percentage,
    ROUND(SUM(CASE WHEN clean_status = 'M' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS medium_percentage,
    ROUND(SUM(CASE WHEN clean_status = 'S' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS severe_percentage
FROM skid_inspection_history
WHERE inspection_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY DATE(inspection_time)
ORDER BY DATE(inspection_time);

-- 视图 - 雪橇近期上下线统计（按天）
CREATE OR REPLACE VIEW `v_skid_status_daily_stats` AS
SELECT 
    DATE(status_change_time) AS status_date,
    COUNT(*) AS total_count,
    SUM(CASE WHEN online_status = 'online' THEN 1 ELSE 0 END) AS online_count,
    SUM(CASE WHEN online_status = 'offline' THEN 1 ELSE 0 END) AS offline_count
FROM skid_status_history
WHERE status_change_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY DATE(status_change_time)
ORDER BY DATE(status_change_time);

-- 视图 - 雪橇详细信息（包含最近检测照片信息）
CREATE OR REPLACE VIEW `v_skid_detail` AS
SELECT 
    sm.id,
    sm.skid_id,
    sm.clean_status,
    sm.inspection_time,
    sm.online_status,
    sm.status_change_time,
    sm.remarks AS skid_remarks,
    sm.last_photo_url,
    sih.inspector AS last_inspector,
    sih.inspection_method AS last_inspection_method,
    sih.remarks AS last_inspection_remarks,
    sih.photos_json AS last_inspection_photos
FROM skid_master sm
LEFT JOIN skid_inspection_history sih ON sm.skid_id = sih.skid_id AND sm.inspection_time = sih.inspection_time;

-- 触发器 - 在插入新的清洁度检测记录后更新主表
DELIMITER //
CREATE TRIGGER `trg_after_inspection_insert`
AFTER INSERT ON skid_inspection_history
FOR EACH ROW
BEGIN
    DECLARE v_photo_url VARCHAR(255) DEFAULT NULL;
    
    -- 检查是否有照片
    IF NEW.photos_json IS NOT NULL AND JSON_LENGTH(NEW.photos_json) > 0 THEN
        -- 获取第一张照片URL
        SET v_photo_url = JSON_UNQUOTE(JSON_EXTRACT(NEW.photos_json, '$[0]'));
    END IF;

    -- 更新雪橇主表，如果新插入的记录时间更晚
    UPDATE skid_master
    SET clean_status = NEW.clean_status,
        inspection_time = NEW.inspection_time,
        last_photo_url = v_photo_url
    WHERE skid_id = NEW.skid_id
    AND (inspection_time < NEW.inspection_time OR inspection_time IS NULL);
END //
DELIMITER ;

-- 触发器 - 在更新清洁度检测记录后更新主表
DELIMITER //
CREATE TRIGGER `trg_after_inspection_update`
AFTER UPDATE ON skid_inspection_history
FOR EACH ROW
BEGIN
    -- 只在清洁度状态或检测时间变化时处理
    IF NEW.clean_status != OLD.clean_status OR NEW.inspection_time != OLD.inspection_time THEN
        DECLARE v_photo_url VARCHAR(255) DEFAULT NULL;
        
        -- 检查是否有照片
        IF NEW.photos_json IS NOT NULL AND JSON_LENGTH(NEW.photos_json) > 0 THEN
            -- 获取第一张照片URL
            SET v_photo_url = JSON_UNQUOTE(JSON_EXTRACT(NEW.photos_json, '$[0]'));
        END IF;
        
        -- 查找该雪橇最新的检测记录
        SELECT id, inspection_time INTO @latest_id, @latest_time
        FROM skid_inspection_history
        WHERE skid_id = NEW.skid_id
        ORDER BY inspection_time DESC
        LIMIT 1;
        
        -- 如果当前修改的记录是最新的检测记录，则更新主表
        IF @latest_id = NEW.id THEN
            UPDATE skid_master
            SET clean_status = NEW.clean_status,
                inspection_time = NEW.inspection_time,
                last_photo_url = v_photo_url
            WHERE skid_id = NEW.skid_id;
        END IF;
        
        -- 如果原来的记录是主表关联的记录，而现在不再是最新的记录，则更新主表为最新记录的状态
        IF OLD.inspection_time = (SELECT inspection_time FROM skid_master WHERE skid_id = OLD.skid_id)
           AND @latest_id != NEW.id THEN
            -- 获取最新记录的照片
            SELECT photos_json INTO @latest_photos
            FROM skid_inspection_history
            WHERE id = @latest_id;
            
            -- 处理最新记录的照片
            SET @latest_photo_url = NULL;
            IF @latest_photos IS NOT NULL AND JSON_LENGTH(@latest_photos) > 0 THEN
                SET @latest_photo_url = JSON_UNQUOTE(JSON_EXTRACT(@latest_photos, '$[0]'));
            END IF;
            
            -- 更新主表为最新记录的状态
            UPDATE skid_master
            SET clean_status = (SELECT clean_status FROM skid_inspection_history WHERE id = @latest_id),
                inspection_time = @latest_time,
                last_photo_url = @latest_photo_url
            WHERE skid_id = OLD.skid_id;
        END IF;
    END IF;
END //
DELIMITER ;

-- 触发器 - 在插入新的上下线记录后更新主表
DELIMITER //
CREATE TRIGGER `trg_after_status_insert`
AFTER INSERT ON skid_status_history
FOR EACH ROW
BEGIN
    -- 更新雪橇主表，如果新插入的记录时间更晚
    UPDATE skid_master
    SET online_status = NEW.online_status,
        status_change_time = NEW.status_change_time
    WHERE skid_id = NEW.skid_id
    AND (status_change_time < NEW.status_change_time OR status_change_time IS NULL);
END //
DELIMITER ;

-- 触发器 - 在更新上下线记录后更新主表
DELIMITER //
CREATE TRIGGER `trg_after_status_update`
AFTER UPDATE ON skid_status_history
FOR EACH ROW
BEGIN
    -- 只在上下线状态或变更时间变化时处理
    IF NEW.online_status != OLD.online_status OR NEW.status_change_time != OLD.status_change_time THEN
        -- 查找该雪橇最新的上下线记录
        SELECT id, status_change_time INTO @latest_id, @latest_time
        FROM skid_status_history
        WHERE skid_id = NEW.skid_id
        ORDER BY status_change_time DESC
        LIMIT 1;
        
        -- 如果当前修改的记录是最新的上下线记录，则更新主表
        IF @latest_id = NEW.id THEN
            UPDATE skid_master
            SET online_status = NEW.online_status,
                status_change_time = NEW.status_change_time
            WHERE skid_id = NEW.skid_id;
        END IF;
        
        -- 如果原来的记录是主表关联的记录，而现在不再是最新的记录，则更新主表为最新记录的状态
        IF OLD.status_change_time = (SELECT status_change_time FROM skid_master WHERE skid_id = OLD.skid_id)
           AND @latest_id != NEW.id THEN
            UPDATE skid_master
            SET online_status = (SELECT online_status FROM skid_status_history WHERE id = @latest_id),
                status_change_time = @latest_time
            WHERE skid_id = OLD.skid_id;
        END IF;
    END IF;
END //
DELIMITER ; 