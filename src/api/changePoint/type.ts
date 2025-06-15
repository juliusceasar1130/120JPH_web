import { number } from "echarts";

//定义eines筛选DTO
// export interface einesDto {
//     model: number;
//     colorCode: string;
//     startTime: string;
//     endTime: string;
//     tunnel: string|number;
//     serialNumber: string;
//     orderBy?: order;
// }
// export interface order {
//     prop: string,
//     order: string,
// }
//返回数据类型
export interface ResponseData {
    "code": number,
    "message": string,
    "ok": boolean//没有用
}
export interface changePointResponseData extends ResponseData {
    data: []
}
// export interface historyDetail {
//     part: number,
//     size: number,
//     station: number,
//     diameter: number,
//     dmesh: number,
// }
// export interface partDefectCount {
//     part: number,
//     count: number
// }

export interface AreaAndLine {
    areaCh: string,
    lines: string[]
}
export interface AreaAndLineList {
    AreaAndLineList: AreaAndLine[]
}
export interface AreaAndLineListResponseData extends ResponseData {
    data: AreaAndLineList
}
export interface query {
    "areaCh": string,
    "line": string,
    "startTime": string,
    "endTime": string,
    "priority":number
}
export interface cpResult {
    areaCh:string,
    iddata:string,
    idserver:string,
    ioitem:string,
    line:string,
    localDts:string,
    nameserver:string,
    newValue:number,
    oldValue:number,
    userId:string,
    equipmentCh:string,
    lineCh:string,
    nameParameter:string
}

export interface cpMapResult {
    id:string,
    ioitem:string,
    areaEn:string,
    areaCh:string,
    lineEn:string,
    lineCh:string,
    equipmentEn:string,
    equipmentCh:number,
    nameParameter:number,
    line:string,
    spare2:string,
    spare3:string,    
}

export type cpResultList= cpResult[]; 
export interface mapQuery{
    areaCh:string,
    line:string,
    keyWord:string
}