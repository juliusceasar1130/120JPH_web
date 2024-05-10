//统一管理数据接口
import request from "@/utils/request";
import {rockPanelDto,ImageListResponseData} from './type'
enum API{
    //获取分页列表L2
    GETRESULTBYPAGE_URL='/rp2/findByPage',
    //通过nr/id获得图片集
    GETIMAGELIST_URL='/rp2/getImageListById/',
    //获取最新的两条数据
    GETLASTRECORD='/rp2/getLastRecord',
    //导出数据
    EXCELDATAEXPORT='/rp2/exportData', 
     //获取最新的goodbad等信息
     GETLASTSTATISTIC='/rp2/getLastStatistic',    
     //获取每小时的平均值，
     GETAGVHOUR='/rp2/getDefectChart',
}
export const reqLine1ResultByPage=(page:number,size:number,data:rockPanelDto)=>request.post<any,any>(API.GETRESULTBYPAGE_URL+`/${page}/${size}`,data)
export const reqLine1ImageListById=(id:number)=>request.get<any,ImageListResponseData>(API.GETIMAGELIST_URL+id)
export const reqLine1LastRecord=()=>request.get<any,any>(API.GETLASTRECORD)
//导出数据
export const reqRp2ExcelDataExport=()=>request.get<any,any>(API.EXCELDATAEXPORT,{responseType:'blob'})
//获取最新的goodbad等信息
export const reqLine2LastStatistic=()=>request.get<any,any>(API.GETLASTSTATISTIC)
export const reqLine2AvgValueHour=(pos:string,data:rockPanelDto)=>request.get<any,any>(API.GETAGVHOUR+`/${pos}`,{params:data})

enum API3{

    //获取分页列表L3
    GETRESULTBYPAGE_URL='/rp3/findByPage',
    //通过nr/id获得图片集
    GETIMAGELIST_URL='/rp3/getImageListById/',
    //获取最新的两条数据
    GETLASTRECORD='/rp3/getLastRecord',
    //导出数据
    EXCELDATAEXPORT='/rp3/exportData', 
     //获取最新的goodbad等信息
     GETLASTSTATISTIC='/rp3/getLastStatistic',    
     //获取每小时的平均值，
     GETAGVHOUR='/rp3/getDefectChart',
} 
export const reqLine3ResultByPage=(page:number,size:number,data:rockPanelDto)=>request.post<any,any>(API3.GETRESULTBYPAGE_URL+`/${page}/${size}`,data)
export const reqLine3ImageListById=(id:number)=>request.get<any,ImageListResponseData>(API3.GETIMAGELIST_URL+id)
export const reqLine3LastRecord=()=>request.get<any,any>(API3.GETLASTRECORD)
export const reqRp3ExcelDataExport=()=>request.get<any,any>(API3.EXCELDATAEXPORT,{responseType:'blob'})
//获取最新的goodbad等信息
export const reqLine3LastStatistic=()=>request.get<any,any>(API3.GETLASTSTATISTIC)
export const reqLine3AvgValueHour=(pos:string,data:rockPanelDto)=>request.get<any,any>(API3.GETAGVHOUR+`/${pos}`,{params:data})

/* ********************* */


