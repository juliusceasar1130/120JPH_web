//登录接口需要携带TS类型
export interface loginFromData {
    "password": string,
    "username": string,
    avatar?:string
    
}
//付接口
export interface ResponseData {
    "code": number,
    "message": string,
    "ok": boolean
}
//登录返回
export interface loginResponseData extends ResponseData {
    'data': string;
    
}
//定义获取用户信息返回类型
export interface userResponseData extends ResponseData {
    'data':{
    routes: string[];
    buttons: string[];
    roles: string[];
    name: string;
    avatar: string;
    id?:number
}
}
