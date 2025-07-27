/**
 * @Author: chenliang 
 * 最后修改时间->2025-07-19 16:35
 */

import request from '@/utils/request'
import type { 
  ResponseData,
  SkidQueryParams, 
  SkidListResponse,
  AddSkidParams,
  UpdateSkidParams,
  InspectionHistoryQueryParams,
  InspectionHistoryResponse,
  StatusHistoryQueryParams,
  StatusHistoryResponse,
  CleanHistoryQueryParams,
  CleanHistoryResponse,
  CleanTrendResponse,
  StatusTrendResponse,
  SkidStatusStatsResponse
} from './type'

/**
 * 获取雪橇列表
 * 功能描述：根据查询条件获取雪橇列表数据，支持分页和筛选
 * 入参：{ page: 当前页码, size: 每页数量, skidId?: 雪橇编号, cleanStatus?: 清洁状态, onlineStatus?: 上下线状态, inspectionTimeStart?: 检测开始时间, inspectionTimeEnd?: 检测结束时间, statusChangeTimeStart?: 状态变更开始时间, statusChangeTimeEnd?: 状态变更结束时间 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { records: 雪橇列表, total: 总数量, size: 每页数量, current: 当前页码 } }
 * url地址：/api/skid/list
 * 请求方式：POST
 */
export function getSkidList(params: SkidQueryParams & { page: number, size: number }) {
  return request.post<any, ResponseData<SkidListResponse>>('/api/skid/list', params)
}

/**
 * 新增雪橇
 * 功能描述：新增一个雪橇记录
 * 入参：{ skidId: 雪橇编号, cleanStatus: 清洁状态, onlineStatus: 上下线状态, remarks?: 备注, photo?: 照片文件 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功 }
 * url地址：/api/skid/add
 * 请求方式：POST
 */
export function addSkid(params: AddSkidParams) {
  // 使用FormData处理文件上传
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    if (key === 'photo' && params.photo) {
      formData.append('photo', params.photo)
    } else {
      formData.append(key, params[key as keyof AddSkidParams] as string)
    }
  })
  
  return request.post<any, ResponseData<null>>('/api/skid/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 更新雪橇信息
 * 功能描述：更新已有雪橇的信息
 * 入参：{ skidId: 雪橇编号, cleanStatus?: 清洁状态, onlineStatus?: 上下线状态, statusChangeTime?: 状态变更时间, remarks?: 备注, photo?: 照片文件 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功 }
 * url地址：/api/skid/update
 * 请求方式：POST
 */
export function updateSkid(params: UpdateSkidParams) {
  // 使用FormData处理文件上传
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    if (key === 'photo' && params.photo) {
      formData.append('photo', params.photo)
    } else if (params[key as keyof UpdateSkidParams] !== undefined) {
      formData.append(key, params[key as keyof UpdateSkidParams] as string)
    }
  })
  
  return request.post<any, ResponseData<null>>('/api/skid/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取雪橇清洁度历史记录
 * 功能描述：获取特定雪橇的清洁度检测历史记录，支持分页和时间筛选
 * 入参：{ skidId: 雪橇编号, page: 当前页码, size: 每页数量, startTime?: 开始时间, endTime?: 结束时间 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { records: 历史记录列表, total: 总数量, size: 每页数量, current: 当前页码 } }
 * url地址：/api/skid/inspection-history
 * 请求方式：POST
 */
export function getSkidInspectionHistory(params: InspectionHistoryQueryParams) {
  return request.post<any, ResponseData<InspectionHistoryResponse>>('/api/skid/inspection-history', params)
}

/**
 * 获取雪橇上下线历史记录
 * 功能描述：获取特定雪橇的上下线历史记录，支持分页和时间筛选
 * 入参：{ skidId: 雪橇编号, page: 当前页码, size: 每页数量, startTime?: 开始时间, endTime?: 结束时间 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { records: 历史记录列表, total: 总数量, size: 每页数量, current: 当前页码 } }
 * url地址：/api/skid/status-history
 * 请求方式：POST
 */
export function getSkidStatusHistory(params: StatusHistoryQueryParams) {
  return request.post<any, ResponseData<StatusHistoryResponse>>('/api/skid/status-history', params)
}

/**
 * 获取雪橇详情
 * 功能描述：根据雪橇编号获取雪橇详细信息
 * 入参：{ skidId: 雪橇编号 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: 雪橇信息 }
 * url地址：/api/skid/detail
 * 请求方式：GET
 */
export function getSkidDetail(skidId: string) {
  return request.get<any, ResponseData<any>>(`/api/skid/detail?skidId=${skidId}`)
} 

/**
 * 获取雪橇清洁度历史记录（带状态筛选）
 * 功能描述：根据雪橇编号获取清洁度历史记录，支持按清洁度状态和时间范围进行筛选
 * 入参：{ skidId: 雪橇编号, cleanStatus?: 清洁度状态, timeRange?: [开始时间, 结束时间], page: 页码, size: 每页数量 }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { records: 历史记录列表, total: 总记录数, size: 每页数量, current: 当前页码 } }
 * url地址：/api/skid/clean-history
 * 请求方式：POST
 */
export function getSkidCleanHistory(params: CleanHistoryQueryParams) {
  return request.post<any, ResponseData<CleanHistoryResponse>>('/api/skid/clean-history', params)
}

/**
 * 获取雪橇清洁度变化趋势数据
 * 功能描述：获取特定雪橇在指定时间范围内的清洁度变化趋势数据
 * 入参：{ skidId: 雪橇编号, timeRange: 时间范围(week/month/year) }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { dates: 日期列表, statusValues: 状态值列表, statusMap: 状态值映射 } }
 * url地址：/api/skid/clean-trend
 * 请求方式：GET
 */
export function getSkidCleanTrend(skidId: string, timeRange: 'week' | 'month' | 'year') {
  return request.get<any, ResponseData<CleanTrendResponse>>(`/api/skid/clean-trend?skidId=${skidId}&timeRange=${timeRange}`)
} 

/**
 * 获取雪橇上下线状态趋势数据
 * 功能描述：获取特定雪橇在指定时间范围内的上下线状态变化趋势数据
 * 入参：{ skidId: 雪橇编号, timeRange: 时间范围(week/month/year) }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { dates: 日期列表, statusValues: 状态值列表, statusMap: 状态值映射 } }
 * url地址：/api/skid/status-trend
 * 请求方式：GET
 */
export function getSkidStatusTrend(skidId: string, timeRange: 'week' | 'month' | 'year') {
  return request.get<any, ResponseData<StatusTrendResponse>>(`/api/skid/status-trend?skidId=${skidId}&timeRange=${timeRange}`)
} 

/**
 * 获取雪橇状态统计数据
 * 功能描述：获取特定雪橇在指定时间范围内的状态统计数据，包括上线时长、上线率和平均连续运行时间
 * 入参：{ skidId: 雪橇编号, timeRange: 时间范围(week/month/year) }
 * 返回参数：{ code: 状态码, message: 响应信息, ok: 是否成功, data: { onlineHours: 上线时长, onlineRate: 上线率, avgRunningTime: 平均连续运行时间 } }
 * url地址：/api/skid/status-stats
 * 请求方式：GET
 */
export function getSkidStatusStats(skidId: string, timeRange: 'week' | 'month' | 'year') {
  return request.get<any, ResponseData<SkidStatusStatsResponse>>(`/api/skid/status-stats?skidId=${skidId}&timeRange=${timeRange}`)
} 