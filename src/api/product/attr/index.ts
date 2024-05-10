import request from "@/utils/request";
import type { CategoryResponseData, AttrResponseData,Attr } from "./type";
//属性管理接口
enum API {
    //获取123级分类的方法
    C1_URL = '/admin/product/getCategory1/',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    //获取已有属性与属性值
    ATTR_URL = '/admin/product/attrInfoList/',
    //修改或者新增属性值
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo/',
    //删除属性
    REMOVEATTR_URL='/admin/product/deleteAttr/'
}
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
export const reqAttr = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
export const reqAddOrUpdateAttr=(data:Attr)=>request.post<any,any>(API.ADDORUPDATEATTR_URL,data)
export const reqRemoveAttr=(Id: number | string)=>request.delete<any,any>(API.REMOVEATTR_URL+Id)