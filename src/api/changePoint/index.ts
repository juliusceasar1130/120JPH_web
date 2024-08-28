//统一管理数据接口
import request from "@/utils/request";
import type{AreaAndLineListResponseData,query,mapQuery} from './type'
enum API{
    //所有区域和条线
    getAreaAndLine='changePointIndex/getAreaAndLine',
    //根据查询获取变化点数据(分组给首页用)
    getDataByQuery='changePointData/getDataByQuery',
    //获取变化点
    getCPDataVoByQuery='changePointData/getCPDataVoByQuery',
    //获取某个点位的历史曲线
    getIoitemHistoryList='changePointData/getIoitemHistoryList',
    //获取点位清单
    getMapByQuery='changePointIndex/getMapByQuery',
}
export const reqGetAreaAndLine=()=>request.get<any,AreaAndLineListResponseData>(API.getAreaAndLine)
export const reqGetDataByQuery=(query:query)=>request.post<any,any>(API.getDataByQuery,query)
export const reqCPDataVoByQuery=(page:number,size:number,query:query)=>request.post<any,any>(API.getCPDataVoByQuery+`/${page}/${size}`,query)
export const reqIoitemHistoryList=(ioitem:any,query:query)=>request.post<any,any>(API.getIoitemHistoryList+`/${ioitem}`,query)
export const reqMapByQuery=(page:number,size:number,query:mapQuery)=>request.post<any,any>(API.getMapByQuery+`/${page}/${size}`,query)
