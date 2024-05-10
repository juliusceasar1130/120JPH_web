//统一管理数据接口
import request from "@/utils/request";
import type { loginFromData, loginResponseData, userResponseData } from './type'

//用户相关的请求地址
enum API {
    LOGIN_URL = "/user/login",
    USERINFO_URL = '/user/getUserInfo',
    LOGOUT_URL = '/admin/acl/index/logout',
    USERUPDATE_URL='/user/userUpdateById',
}
//登录接口,返回romise对象，await 则获得response
export const reqLogin = (data: loginFromData) => request.post<any, loginResponseData>(API.LOGIN_URL, data);
export const reqUserInfo = () => request.get<any, userResponseData>(API.USERINFO_URL);
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);
export const reqUserUpdateById = (Id:number,data:loginFromData) => request.put<any, any>(API.USERUPDATE_URL+`/${Id}`,data);