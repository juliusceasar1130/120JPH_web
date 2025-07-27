//统一管理数据接口
import request from "@/utils/request";
import type { TradeMarkResponseData, TradeMark } from "./type";
import { ElMessage } from 'element-plus'

//品牌接口地址
enum API {
    //获取已有品牌接口
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    //添加品牌的接口地址
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    //修改品牌
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    //删除已有的品牌
    DELETE_URL = '/admin/product/baseTrademark/remove/'

}
//获取已有组件方法
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`);
//添加品牌或者修改
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
    //修改
    if (data.id) {
        return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
    } else {
        //新增
        return request.post<any, any>(API.ADDTRADEMARK_URL, data)

    }

}
//删除已有品牌的接口，返回没有返回值？需要return
export const reqDeleteTrademark = (id: number) => {
     return request.delete<any, any>(API.DELETE_URL + `${id}`);
    
    }


