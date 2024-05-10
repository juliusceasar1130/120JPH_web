//统一管理数据接口
import request from "@/utils/request";
import {einesDto,einesResponseData} from './type'
enum API{
    //获取分页查询列表
    GETEINESBYPAGE='eines/historyAndDetailPage',
    //获取最后的N条数据
    GETLASTN='eines/historyLastN',
}
export const reqEineshistoryAndDetailPage=(page:number,size:number,query:einesDto)=>request.post<any,einesResponseData>(API.GETEINESBYPAGE+`/${page}/${size}`,query)
export const reqEineshistoryVoLastN=(num:number,tunnel:number)=>request.get<any,einesResponseData>(API.GETLASTN+`/${num}/${tunnel}`)