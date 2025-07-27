# 雪橇管理系统 - 数据库设计文档

**最后更新时间: 2024-05-15 18:00**

## 数据库概述

雪橇(Skid)管理系统的数据库设计，用于支持雪橇清洁度状态管理系统的所有功能，包括雪橇一览表、清洁度检测历史和上下线历史等核心功能。

## 表结构设计

系统包含三个主要表：

### 1. 雪橇主表 (skid_master)

存储雪橇的基本信息和当前状态。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT UNSIGNED | 主键ID，自增 |
| skid_id | VARCHAR(20) | 雪橇编号，唯一 |
| clean_status | ENUM('C', 'M', 'S') | 清洁度状态：C-清洁, M-中度, S-严重 |
| inspection_time | DATETIME | 检测时间 |
| online_status | ENUM('online', 'offline') | 上下线状态：online-在线, offline-离线 |
| status_change_time | DATETIME | 上下线时间 |
| remarks | TEXT | 备注 |
| last_photo_url | VARCHAR(255) | 最新检测照片URL |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 2. 雪橇清洁度检测历史表 (skid_inspection_history)

记录每次清洁度检测的历史数据，包括照片信息。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT UNSIGNED | 主键ID，自增 |
| skid_id | VARCHAR(20) | 雪橇编号，外键 |
| inspection_time | DATETIME | 检测时间 |
| clean_status | ENUM('C', 'M', 'S') | 清洁度状态：C-清洁, M-中度, S-严重 |
| inspector | VARCHAR(50) | 检测人员 |
| inspection_method | VARCHAR(50) | 检测方式 |
| remarks | TEXT | 备注 |
| photos_json | JSON | 照片URL数组，JSON格式 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 3. 雪橇上下线历史表 (skid_status_history)

记录雪橇上下线的历史数据。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT UNSIGNED | 主键ID，自增 |
| skid_id | VARCHAR(20) | 雪橇编号，外键 |
| status_change_time | DATETIME | 状态变更时间 |
| online_status | ENUM('online', 'offline') | 上下线状态：online-在线, offline-离线 |
| operator | VARCHAR(50) | 操作人员 |
| duration | VARCHAR(50) | 持续时间 |
| reason | TEXT | 原因 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 关系设计

* **skid_master** 与 **skid_inspection_history** 是一对多关系，通过 skid_id 关联
* **skid_master** 与 **skid_status_history** 是一对多关系，通过 skid_id 关联

## 视图设计

系统包含以下视图用于数据统计和查询：

1. **v_skid_clean_status_stats** - 雪橇清洁状态统计
2. **v_skid_online_status_stats** - 雪橇上下线状态统计
3. **v_skid_inspection_daily_stats** - 雪橇近期清洁度检测统计（按天）
4. **v_skid_status_daily_stats** - 雪橇近期上下线统计（按天）
5. **v_skid_detail** - 雪橇详细信息（包含最近检测照片信息）

## 存储过程设计

系统实现了以下存储过程用于业务逻辑处理：

### 雪橇主表相关
- **sp_query_skid_list** - 按条件查询雪橇一览表
- **sp_add_skid** - 新增雪橇记录
- **sp_update_skid** - 更新雪橇记录

### 清洁度检测相关
- **sp_query_inspection_history** - 按条件查询清洁度检测历史记录
- **sp_add_inspection** - 新增清洁度检测记录（包含照片）
- **sp_delete_inspection_record** - 删除清洁度检测记录

### 上下线状态相关
- **sp_query_status_history** - 按条件查询上下线历史记录
- **sp_add_status_record** - 新增上下线历史记录
- **sp_update_status_record** - 更新上下线历史记录
- **sp_delete_status_record** - 删除上下线历史记录

## 触发器设计

系统实现了以下触发器以保持数据一致性：

1. **trg_after_inspection_insert** - 插入新的清洁度检测记录后更新主表
2. **trg_after_inspection_update** - 更新清洁度检测记录后更新主表
3. **trg_after_status_insert** - 插入新的上下线记录后更新主表
4. **trg_after_status_update** - 更新上下线记录后更新主表

## 数据设计说明

### 清洁度检测照片存储

清洁度检测的照片信息直接存储在检测历史表中，使用JSON数组格式。这种设计的优点：

1. **简化数据访问** - 读取检测记录时可以同时获取所有照片，无需额外查询
2. **维护数据完整性** - 删除检测记录时自动删除相关照片信息
3. **提高查询性能** - 减少表连接操作
4. **灵活性** - JSON格式支持存储不定数量的照片URL

JSON存储格式示例：
```json
[
  "https://example.com/photos/photo1.jpg",
  "https://example.com/photos/photo2.jpg",
  "https://example.com/photos/photo3.jpg"
]
```

### 状态更新机制

1. 系统通过触发器自动维护雪橇主表中的最新状态（清洁度、上下线状态）
2. 当插入、更新或删除历史记录时，触发器会自动检查并更新主表中的状态信息
3. 主表中的状态始终反映最新的检测结果和上下线状态

## 使用示例

### 查询雪橇列表（带筛选条件）

```sql
CALL sp_query_skid_list('SK00', 'C', 'online', '2024-05-01', '2024-05-15', NULL, NULL, 1, 10);
```

### 新增清洁度检测记录（带照片）

```sql
CALL sp_add_inspection(
  'SK001', 
  '2024-05-15 14:30:00', 
  'C', 
  '张三', 
  '自动检测', 
  '例行检查，未发现异常', 
  JSON_ARRAY('https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'),
  @result
);
```

### 查询雪橇清洁度检测历史

```sql
CALL sp_query_inspection_history('SK001', NULL, '2024-05-01', '2024-05-15', 1, 20);
```

### 新增上下线记录

```sql
CALL sp_add_status_record(
  'SK001', 
  '2024-05-15 08:00:00', 
  'online', 
  '李四', 
  '16小时30分', 
  '例行上线',
  @result
);
```

## 注意事项

1. 清洁度检测照片通过JSON数组格式存储在inspection_history表中
2. 主表只保存最新检测照片的URL，用于列表显示
3. 上下线持续时间需要定期计算和更新
4. 所有时间字段使用DATETIME类型，支持精确的时间查询和比较

## 数据库初始化

初始化脚本包含三个部分：

1. **skid_tables.sql** - 创建数据库、表结构和初始化数据
2. **skid_procedures.sql** - 创建存储过程
3. **skid_views.sql** - 创建视图和触发器 