//统一管理数据接口
import request from "@/utils/request";

enum API{
    //通过FIS号码获得MDS信息
    traceSearchByFis='bodyTrack/traceSearchByFis',
    //通过条件获得MDS信息
    traceSearchByCondition='bodyTrack/traceSearchByCondition',
    //通过日期时间获得第一辆车
    firstCarByDateTime='bodyTrack/firstCarByDateTime',   
}
export const reqtraceSearchByFis=(fis:string)=>request.get<any,any>(API.traceSearchByFis+`/${fis}`)
export const reqtraceSearchByCondition=(params:any)=>request.get<any,any>(API.traceSearchByCondition,{params})
export const reqfirstCarByDateTime=(params:any)=>request.get<any,any>(API.firstCarByDateTime,{params})
