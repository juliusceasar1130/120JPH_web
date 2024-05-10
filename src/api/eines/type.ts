import { number } from "echarts";

//定义eines筛选DTO
export interface einesDto {
    model: number;
    colorCode: string;
    startTime: string;
    endTime: string;
    tunnel: string|number;
    serialNumber: string;
    orderBy?: order;
}
export interface order {
    prop: string,
    order: string,
}
//返回数据类型
export interface ResponseData {
    "code": number,
    "message": string,
    "ok": boolean//没有用
}
export interface einesResponseData extends ResponseData {
    data: []
}
export interface historyDetail {
    part: number,
    size: number,
    station: number,
    diameter: number,
    dmesh: number,
}
// export interface partDefectCount {
//     part: number,
//     count: number
// }

export interface HistoryVo {
    colorCode: string,
    cycle: number,
    dateTime: string,
    defectCount: number,
    historyId: string,
    model: number,
    serialNumber: string,
    tunnel: string|number,
    historyDetailList?: historyDetail[]
    partDefectCount?: string
}