/*
 * @Author: julius 2024-05-15 
 * @LastEditTime: 2024-05-15 17:40
 * 雪橇管理系统数据库存储过程
 */

USE skid_management_system;

-- 存储过程 - 按条件查询雪橇一览表
DELIMITER //
CREATE PROCEDURE `sp_query_skid_list`(
    IN p_skid_id VARCHAR(20),
    IN p_clean_status ENUM('C', 'M', 'S'),
    IN p_online_status ENUM('online', 'offline'),
    IN p_inspection_start_time DATETIME,
    IN p_inspection_end_time DATETIME,
    IN p_status_change_start_time DATETIME,
    IN p_status_change_end_time DATETIME,
    IN p_page_index INT,
    IN p_page_size INT
)
BEGIN
    DECLARE v_offset INT;
    DECLARE v_count INT;
    
    -- 计算分页起始位置
    SET v_offset = (p_page_index - 1) * p_page_size;
    
    -- 构建WHERE子句
    SET @where_clause = '1=1';
    
    -- 添加查询条件
    IF p_skid_id IS NOT NULL AND p_skid_id != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND skid_id LIKE "%', p_skid_id, '%"');
    END IF;
    
    IF p_clean_status IS NOT NULL AND p_clean_status != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND clean_status = "', p_clean_status, '"');
    END IF;
    
    IF p_online_status IS NOT NULL AND p_online_status != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND online_status = "', p_online_status, '"');
    END IF;
    
    IF p_inspection_start_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND inspection_time >= "', p_inspection_start_time, '"');
    END IF;
    
    IF p_inspection_end_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND inspection_time <= "', p_inspection_end_time, '"');
    END IF;
    
    IF p_status_change_start_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND status_change_time >= "', p_status_change_start_time, '"');
    END IF;
    
    IF p_status_change_end_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND status_change_time <= "', p_status_change_end_time, '"');
    END IF;
    
    -- 查询符合条件的总记录数
    SET @count_sql = CONCAT('SELECT COUNT(*) INTO @total_count FROM skid_master WHERE ', @where_clause);
    PREPARE stmt FROM @count_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- 查询分页数据
    SET @query_sql = CONCAT('SELECT id, skid_id, clean_status, inspection_time, online_status, status_change_time, remarks, last_photo_url FROM skid_master WHERE ', @where_clause, ' ORDER BY skid_id LIMIT ', v_offset, ', ', p_page_size);
    PREPARE stmt FROM @query_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- 返回总记录数
    SELECT @total_count AS total_count;
END //
DELIMITER ;

-- 存储过程 - 新增雪橇记录
DELIMITER //
CREATE PROCEDURE `sp_add_skid`(
    IN p_skid_id VARCHAR(20),
    IN p_clean_status ENUM('C', 'M', 'S'),
    IN p_inspection_time DATETIME,
    IN p_online_status ENUM('online', 'offline'),
    IN p_status_change_time DATETIME,
    IN p_remarks TEXT,
    IN p_last_photo_url VARCHAR(255),
    OUT p_result INT
)
BEGIN
    DECLARE v_count INT;
    
    -- 检查雪橇ID是否已存在
    SELECT COUNT(*) INTO v_count FROM skid_master WHERE skid_id = p_skid_id;
    
    IF v_count > 0 THEN
        -- 雪橇ID已存在
        SET p_result = 0;
    ELSE
        -- 插入新雪橇记录
        INSERT INTO skid_master (skid_id, clean_status, inspection_time, online_status, status_change_time, remarks, last_photo_url)
        VALUES (p_skid_id, p_clean_status, p_inspection_time, p_online_status, p_status_change_time, p_remarks, p_last_photo_url);
        
        -- 返回新插入记录的ID
        SET p_result = LAST_INSERT_ID();
    END IF;
END //
DELIMITER ;

-- 存储过程 - 更新雪橇记录
DELIMITER //
CREATE PROCEDURE `sp_update_skid`(
    IN p_skid_id VARCHAR(20),
    IN p_clean_status ENUM('C', 'M', 'S'),
    IN p_inspection_time DATETIME,
    IN p_online_status ENUM('online', 'offline'),
    IN p_status_change_time DATETIME,
    IN p_remarks TEXT,
    IN p_last_photo_url VARCHAR(255),
    OUT p_result INT
)
BEGIN
    DECLARE v_count INT;
    
    -- 检查雪橇ID是否存在
    SELECT COUNT(*) INTO v_count FROM skid_master WHERE skid_id = p_skid_id;
    
    IF v_count = 0 THEN
        -- 雪橇ID不存在
        SET p_result = 0;
    ELSE
        -- 更新雪橇记录
        UPDATE skid_master
        SET clean_status = p_clean_status,
            inspection_time = p_inspection_time,
            online_status = p_online_status,
            status_change_time = p_status_change_time,
            remarks = p_remarks,
            last_photo_url = CASE WHEN p_last_photo_url IS NOT NULL AND p_last_photo_url != '' THEN p_last_photo_url ELSE last_photo_url END
        WHERE skid_id = p_skid_id;
        
        -- 返回影响的行数
        SET p_result = ROW_COUNT();
    END IF;
END //
DELIMITER ;

-- 存储过程 - 按条件查询清洁度检测历史记录
DELIMITER //
CREATE PROCEDURE `sp_query_inspection_history`(
    IN p_skid_id VARCHAR(20),
    IN p_clean_status ENUM('C', 'M', 'S'),
    IN p_start_time DATETIME,
    IN p_end_time DATETIME,
    IN p_page_index INT,
    IN p_page_size INT
)
BEGIN
    DECLARE v_offset INT;
    
    -- 计算分页起始位置
    SET v_offset = (p_page_index - 1) * p_page_size;
    
    -- 构建WHERE子句
    SET @where_clause = '1=1';
    
    -- 添加查询条件
    IF p_skid_id IS NOT NULL AND p_skid_id != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND skid_id = "', p_skid_id, '"');
    END IF;
    
    IF p_clean_status IS NOT NULL AND p_clean_status != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND clean_status = "', p_clean_status, '"');
    END IF;
    
    IF p_start_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND inspection_time >= "', p_start_time, '"');
    END IF;
    
    IF p_end_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND inspection_time <= "', p_end_time, '"');
    END IF;
    
    -- 查询符合条件的总记录数
    SET @count_sql = CONCAT('SELECT COUNT(*) INTO @total_count FROM skid_inspection_history WHERE ', @where_clause);
    PREPARE stmt FROM @count_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- 查询分页数据（直接获取照片JSON数据）
    SET @query_sql = CONCAT(
        'SELECT 
            id, 
            skid_id, 
            inspection_time, 
            clean_status, 
            inspector, 
            inspection_method, 
            remarks,
            photos_json
        FROM skid_inspection_history 
        WHERE ', @where_clause, ' 
        ORDER BY inspection_time DESC 
        LIMIT ', v_offset, ', ', p_page_size
    );
    PREPARE stmt FROM @query_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- 返回总记录数
    SELECT @total_count AS total_count;
END //
DELIMITER ;

-- 存储过程 - 新增清洁度检测记录（包含照片）
DELIMITER //
CREATE PROCEDURE `sp_add_inspection`(
    IN p_skid_id VARCHAR(20),
    IN p_inspection_time DATETIME,
    IN p_clean_status ENUM('C', 'M', 'S'),
    IN p_inspector VARCHAR(50),
    IN p_inspection_method VARCHAR(50),
    IN p_remarks TEXT,
    IN p_photos JSON,
    OUT p_result INT
)
BEGIN
    -- 开始事务
    START TRANSACTION;
    
    -- 插入检测记录（直接带照片JSON）
    INSERT INTO skid_inspection_history (skid_id, inspection_time, clean_status, inspector, inspection_method, remarks, photos_json)
    VALUES (p_skid_id, p_inspection_time, p_clean_status, p_inspector, p_inspection_method, p_remarks, p_photos);
    
    -- 获取新插入记录的ID
    SET p_result = LAST_INSERT_ID();
    
    -- 如果是最新记录，更新主表的清洁状态和最新照片
    IF p_photos IS NOT NULL AND JSON_LENGTH(p_photos) > 0 THEN
        UPDATE skid_master
        SET clean_status = p_clean_status,
            inspection_time = p_inspection_time,
            last_photo_url = JSON_UNQUOTE(JSON_EXTRACT(p_photos, '$[0]'))
        WHERE skid_id = p_skid_id
        AND (inspection_time < p_inspection_time OR inspection_time IS NULL);
    ELSE
        -- 如果是最新记录但没有照片，仅更新主表的清洁状态
        UPDATE skid_master
        SET clean_status = p_clean_status,
            inspection_time = p_inspection_time
        WHERE skid_id = p_skid_id
        AND (inspection_time < p_inspection_time OR inspection_time IS NULL);
    END IF;
    
    -- 提交事务
    COMMIT;
END //
DELIMITER ;

-- 存储过程 - 按条件查询上下线历史记录
DELIMITER //
CREATE PROCEDURE `sp_query_status_history`(
    IN p_skid_id VARCHAR(20),
    IN p_online_status ENUM('online', 'offline'),
    IN p_start_time DATETIME,
    IN p_end_time DATETIME,
    IN p_page_index INT,
    IN p_page_size INT
)
BEGIN
    DECLARE v_offset INT;
    
    -- 计算分页起始位置
    SET v_offset = (p_page_index - 1) * p_page_size;
    
    -- 构建WHERE子句
    SET @where_clause = '1=1';
    
    -- 添加查询条件
    IF p_skid_id IS NOT NULL AND p_skid_id != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND skid_id = "', p_skid_id, '"');
    END IF;
    
    IF p_online_status IS NOT NULL AND p_online_status != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND online_status = "', p_online_status, '"');
    END IF;
    
    IF p_start_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND status_change_time >= "', p_start_time, '"');
    END IF;
    
    IF p_end_time IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND status_change_time <= "', p_end_time, '"');
    END IF;
    
    -- 查询符合条件的总记录数
    SET @count_sql = CONCAT('SELECT COUNT(*) INTO @total_count FROM skid_status_history WHERE ', @where_clause);
    PREPARE stmt FROM @count_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- 查询分页数据
    SET @query_sql = CONCAT(
        'SELECT id, skid_id, status_change_time, online_status, operator, duration, reason 
        FROM skid_status_history 
        WHERE ', @where_clause, ' 
        ORDER BY status_change_time DESC 
        LIMIT ', v_offset, ', ', p_page_size
    );
    PREPARE stmt FROM @query_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- 返回总记录数
    SELECT @total_count AS total_count;
END //
DELIMITER ;

-- 存储过程 - 新增上下线历史记录
DELIMITER //
CREATE PROCEDURE `sp_add_status_record`(
    IN p_skid_id VARCHAR(20),
    IN p_status_change_time DATETIME,
    IN p_online_status ENUM('online', 'offline'),
    IN p_operator VARCHAR(50),
    IN p_duration VARCHAR(50),
    IN p_reason TEXT,
    OUT p_result INT
)
BEGIN
    -- 插入上下线记录
    INSERT INTO skid_status_history (skid_id, status_change_time, online_status, operator, duration, reason)
    VALUES (p_skid_id, p_status_change_time, p_online_status, p_operator, p_duration, p_reason);
    
    -- 获取新插入记录的ID
    SET p_result = LAST_INSERT_ID();
    
    -- 如果是最新记录，更新主表的上下线状态
    UPDATE skid_master
    SET online_status = p_online_status,
        status_change_time = p_status_change_time
    WHERE skid_id = p_skid_id
    AND (status_change_time < p_status_change_time OR status_change_time IS NULL);
END //
DELIMITER ;

-- 存储过程 - 更新上下线历史记录
DELIMITER //
CREATE PROCEDURE `sp_update_status_record`(
    IN p_id INT,
    IN p_status_change_time DATETIME,
    IN p_online_status ENUM('online', 'offline'),
    IN p_operator VARCHAR(50),
    IN p_duration VARCHAR(50),
    IN p_reason TEXT,
    OUT p_result INT
)
BEGIN
    DECLARE v_skid_id VARCHAR(20);
    DECLARE v_old_time DATETIME;
    
    -- 获取原记录信息
    SELECT skid_id, status_change_time INTO v_skid_id, v_old_time
    FROM skid_status_history
    WHERE id = p_id;
    
    -- 如果找不到记录，返回0
    IF v_skid_id IS NULL THEN
        SET p_result = 0;
        RETURN;
    END IF;
    
    -- 更新记录
    UPDATE skid_status_history
    SET status_change_time = p_status_change_time,
        online_status = p_online_status,
        operator = p_operator,
        duration = p_duration,
        reason = p_reason
    WHERE id = p_id;
    
    -- 检查是否需要更新主表（如果原记录时间是雪橇当前状态的时间）
    IF EXISTS (
        SELECT 1 FROM skid_master 
        WHERE skid_id = v_skid_id AND status_change_time = v_old_time
    ) THEN
        -- 查找该雪橇最新的上下线记录
        SELECT id, status_change_time, online_status
        INTO @newest_id, @newest_time, @newest_status
        FROM skid_status_history
        WHERE skid_id = v_skid_id
        ORDER BY status_change_time DESC
        LIMIT 1;
        
        -- 更新主表的上下线状态为最新记录的状态
        UPDATE skid_master
        SET online_status = @newest_status,
            status_change_time = @newest_time
        WHERE skid_id = v_skid_id;
    END IF;
    
    -- 返回影响的行数
    SET p_result = ROW_COUNT();
END //
DELIMITER ;

-- 存储过程 - 删除上下线历史记录
DELIMITER //
CREATE PROCEDURE `sp_delete_status_record`(
    IN p_id INT,
    OUT p_result INT
)
BEGIN
    DECLARE v_skid_id VARCHAR(20);
    DECLARE v_time DATETIME;
    
    -- 获取原记录信息
    SELECT skid_id, status_change_time INTO v_skid_id, v_time
    FROM skid_status_history
    WHERE id = p_id;
    
    -- 如果找不到记录，返回0
    IF v_skid_id IS NULL THEN
        SET p_result = 0;
        RETURN;
    END IF;
    
    -- 删除记录
    DELETE FROM skid_status_history WHERE id = p_id;
    
    -- 检查是否需要更新主表（如果删除的记录是雪橇当前状态的记录）
    IF EXISTS (
        SELECT 1 FROM skid_master 
        WHERE skid_id = v_skid_id AND status_change_time = v_time
    ) THEN
        -- 查找该雪橇最新的上下线记录
        SELECT id, status_change_time, online_status
        INTO @newest_id, @newest_time, @newest_status
        FROM skid_status_history
        WHERE skid_id = v_skid_id
        ORDER BY status_change_time DESC
        LIMIT 1;
        
        IF @newest_id IS NOT NULL THEN
            -- 更新主表的上下线状态为最新记录的状态
            UPDATE skid_master
            SET online_status = @newest_status,
                status_change_time = @newest_time
            WHERE skid_id = v_skid_id;
        END IF;
    END IF;
    
    -- 返回影响的行数
    SET p_result = ROW_COUNT();
END //
DELIMITER ;

-- 存储过程 - 删除清洁度检测记录
DELIMITER //
CREATE PROCEDURE `sp_delete_inspection_record`(
    IN p_id INT,
    OUT p_result INT
)
BEGIN
    DECLARE v_skid_id VARCHAR(20);
    DECLARE v_time DATETIME;
    
    -- 获取原记录信息
    SELECT skid_id, inspection_time INTO v_skid_id, v_time
    FROM skid_inspection_history
    WHERE id = p_id;
    
    -- 如果找不到记录，返回0
    IF v_skid_id IS NULL THEN
        SET p_result = 0;
        RETURN;
    END IF;
    
    -- 删除检测记录（照片信息已经包含在记录中，不需要单独删除）
    DELETE FROM skid_inspection_history WHERE id = p_id;
    
    -- 检查是否需要更新主表（如果删除的记录是雪橇当前状态的记录）
    IF EXISTS (
        SELECT 1 FROM skid_master 
        WHERE skid_id = v_skid_id AND inspection_time = v_time
    ) THEN
        -- 查找该雪橇最新的检测记录及其照片
        SELECT id, inspection_time, clean_status, photos_json
        INTO @newest_id, @newest_time, @newest_status, @newest_photos
        FROM skid_inspection_history
        WHERE skid_id = v_skid_id
        ORDER BY inspection_time DESC
        LIMIT 1;
        
        -- 设置默认照片URL为NULL
        SET @newest_photo_url = NULL;
        
        -- 检查是否有照片，如果有，获取第一张
        IF @newest_photos IS NOT NULL AND JSON_LENGTH(@newest_photos) > 0 THEN
            SET @newest_photo_url = JSON_UNQUOTE(JSON_EXTRACT(@newest_photos, '$[0]'));
        END IF;
        
        -- 如果找到了最新记录，更新主表状态
        IF @newest_id IS NOT NULL THEN
            UPDATE skid_master
            SET clean_status = @newest_status,
                inspection_time = @newest_time,
                last_photo_url = @newest_photo_url
            WHERE skid_id = v_skid_id;
        END IF;
    END IF;
    
    -- 返回影响的行数
    SET p_result = ROW_COUNT();
END //
DELIMITER ; 