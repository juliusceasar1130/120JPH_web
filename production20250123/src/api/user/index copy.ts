//统一管理数据接口
import request from "@/utils/request";
import type { loginForm, loginResponseData, userResponseData } from './type'
enum API {
    LOGIN_URL = '/user/login',
    USERINFO_URL = '/user/info',
    LOGOUT_URL = '/admin/acl/index/logout'
}
//暴露接口函数
//登录接口
export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data);
//获取用户信息,请求头带参数，此处略
export const reqUserInfo = () => request.get<any, userResponseData>(API.USERINFO_URL);
