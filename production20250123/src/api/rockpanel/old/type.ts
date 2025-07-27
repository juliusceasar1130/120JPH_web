//定义RP筛选DTO
export interface rockPanelDto {
    skidNumber: string;
    carType: string;
    carNumber: string;
    eva: string;
    startTime: string;
    endTime: string;
    imgList?: string;
    orderBy?: order;

}
export interface order {
    prop: string,
    order: string,

}

//定义返回父接口
export interface ResponseData {
    "code": number,
    "message": string,
    "ok": boolean//没有用
}
//定义筛选返回后的清单，没有做
//定义通过ID获得记录的图片集
export interface Image {
    name: string;
    url: string;
}
export interface ImageListResponseData extends ResponseData {
    data: Image[]
}
//定义dialogInfo的形式
export interface dialogInfoType {
    Nr: number,
    SkidNumber: string,
    CarNumber: string,
    imgList: Image[],
}
//定义最后一辆车的数据
export interface lefcarinfo{
    carnumber: number,
    cartype: string,
    date: string,
    eva: string,
    nr: number,
    skidnumber:string    
}
export interface rightcarinfo{
    carnumber: number,
    cartype: string,
    date: string,
    eva: string,
    nr: number, 
    skidnumber:string
   
}

