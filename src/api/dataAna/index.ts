//统一管理数据接口
import request from "@/utils/request";
//import type{AreaAndLineListResponseData,query,mapQuery} from './type'
enum API{
    //某条线的清洁时刻表
    cleanSchedule='dataAna/cleanSchedule',
    ////获取清洗的缺陷均值和过车数量
    carsDefectsAndLabel='dataAna/carsDefectsAndLabel',
    //获取换色的缺陷均值和过车数量
    carsDefectsAndCounts='dataAna/carsDefectsAndCounts',
    ////获取清洗的缺陷均值和过车数量（返工车）
    carsDefectsAndLabelRework='dataAna/carsDefectsAndLabelRework',
    ////获取最新2条统计信息
    staticticsInfo='dataAna/staticticsInfo',
   
}
export const reqcleanSchedule=(line:number)=>request.get<any,any>(API.cleanSchedule+`/${line}`)
export const reqcarsDefectsAndLabel=(line:number, time_begin:string, time_end:string)=>request.get<any,any>(API.carsDefectsAndLabel+`/${line}`+`/${time_begin}`+`/${time_end}`)
export const reqcarsDefectsAndCounts=(line:number, time_begin:string, time_end:string)=>request.get<any,any>(API.carsDefectsAndCounts+`/${line}`+`/${time_begin}`+`/${time_end}`)
export const reqcarsDefectsAndLabelRework=(line:number, time_begin:string, time_end:string)=>request.get<any,any>(API.carsDefectsAndLabelRework+`/${line}`+`/${time_begin}`+`/${time_end}`)
export const reqstaticticsInfo=(line:number, time_begin:string, time_end:string)=>request.get<any,any>(API.staticticsInfo+`/${line}`+`/${time_begin}`+`/${time_end}`)

