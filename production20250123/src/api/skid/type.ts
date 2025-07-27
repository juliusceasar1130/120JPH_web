/**
 * @Author: chenliang 
 * 最后修改时间->2025-07-19 09:30
 */

// 通用响应类型
export interface ResponseData<T = any> {
  code: number;
  message: string;
  ok: boolean;
  data?: T;
}

// 雪橇基本信息类型
export interface SkidInfo {
  skidId: string;
  cleanStatus: 'C' | 'M' | 'S';
  inspectionTime: string;
  onlineStatus: 'online' | 'offline' | 'cleaning';
  statusChangeTime: string;
  remarks?: string;
  lastPhoto?: string;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  size: number;
}

// 雪橇筛选条件类型
export interface SkidQueryParams {
  skidId?: string;
  cleanStatus?: 'C' | 'M' | 'S';
  onlineStatus?: 'online' | 'offline' | 'cleaning';
  inspectionTimeStart?: string;
  inspectionTimeEnd?: string;
  statusChangeTimeStart?: string;
  statusChangeTimeEnd?: string;
}

// 雪橇列表响应数据类型
export interface SkidListResponse {
  records: SkidInfo[];
  total: number;
  size: number;
  current: number;
}

// 雪橇清洁度检测历史记录类型
export interface SkidInspectionHistory {
  id: number;
  skidId: string;
  inspectionTime: string;
  cleanStatus: 'C' | 'M' | 'S';
  inspector: string;
  inspectionMethod: string;
  photoUrl?: string;
  remarks?: string;
}

// 雪橇清洁度历史查询参数
export interface InspectionHistoryQueryParams extends PaginationParams {
  skidId: string;
  startTime?: string;
  endTime?: string;
}

// 雪橇清洁度历史响应数据类型
export interface InspectionHistoryResponse {
  records: SkidInspectionHistory[];
  total: number;
  size: number;
  current: number;
}

// 雪橇上下线历史记录类型
export interface SkidStatusHistory {
  id: number;
  skidId: string;
  statusChangeTime: string;
  onlineStatus: 'online' | 'offline' | 'cleaning';
  operator: string;
  duration?: string;
  reason?: string;
}

// 雪橇上下线历史查询参数
export interface StatusHistoryQueryParams extends PaginationParams {
  skidId: string;
  startTime?: string;
  endTime?: string;
  onlineStatus?: 'online' | 'offline' | 'cleaning';
}

// 雪橇上下线历史响应数据类型
export interface StatusHistoryResponse {
  records: SkidStatusHistory[];
  total: number;
  size: number;
  current: number;
}

// 新增雪橇参数类型
export interface AddSkidParams {
  skidId: string;
  cleanStatus: 'C' | 'M' | 'S';
  onlineStatus: 'online' | 'offline' | 'cleaning';
  inspectionTime?: string;
  statusChangeTime?: string;
  remarks?: string;
  lastPhoto?: string;
  createdAt?: string;
  updatedAt?: string;
  photo?: File;
}

// 编辑雪橇参数类型
export interface UpdateSkidParams {
  skidId: string;
  cleanStatus?: 'C' | 'M' | 'S';
  onlineStatus?: 'online' | 'offline' | 'cleaning';
  remarks?: string;
  statusChangeTime?: string;
  photo?: File;
} 

// 雪橇清洁度历史记录（带状态筛选）查询参数
export interface CleanHistoryQueryParams extends PaginationParams {
  skidId: string;
  cleanStatus?: 'C' | 'M' | 'S';
  timeRange?: [string, string];
}

// 雪橇清洁度历史记录（带状态筛选）响应数据类型
export interface CleanHistoryResponse {
  records: {
    id: number;
    skidId: string;
    inspectionTime: string;
    cleanStatus: 'C' | 'M' | 'S';
    inspector: string;
    inspectionMethod: string;
    remarks?: string;
    photos?: string[];
  }[];
  total: number;
  size: number;
  current: number;
}

// 雪橇清洁度趋势数据响应类型
export interface CleanTrendResponse {
  dates: string[];
  statusValues: number[];
  statusMap: {
    [key: string]: string;
  };
} 

// 雪橇上下线状态趋势数据响应类型
export interface StatusTrendResponse {
  dates: string[];
  statusValues: number[];
  statusMap: {
    [key: string]: string;
  };
} 

// 雪橇状态统计数据响应类型
export interface SkidStatusStatsResponse {
  onlineHours: number;
  onlineRate: string;
  avgRunningTime: number;
} 