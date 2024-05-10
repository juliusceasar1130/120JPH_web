
import request from "@/utils/request";
import type { SpuData,SkuData,SkuInfoData,AllTradeMark, HasSpuResponseData, SpuImg, SaleAttrResponseData, HasSaleAttrResponseData } from "./type"

enum API {
    //获取3级下SPU产品
    HASSPU_URL = '/admin/product/',
    //获取全部品牌数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList/',
    //获取某个SPU下面所有照片的
    IMAGE_URL = '/admin/product/spuImageList/',
    //SPU销售属性列表
    SPUHASATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取全部的销售属性
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    //追加一个新的spu
    ADDSPU_URL = '/admin/product/saveSpuInfo/',
    //更新已有的SPU
    UPDATESPU_URL = '/admin/product/updateSpuInfo/',
    //新增Sku的地址
    ADDSKU_URL='/admin/product/saveSkuInfo',
    //查看某个已有SPU下全部售卖的商品
    SKUINFO_URL='/admin/product/findBySpuId/',
    //删除SPU
    REMOVESPU_URL='/admin/product/deleteSpu/'
}



export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `/${page}/${limit}/?category3Id=${category3Id}`)
export const reqAllTradeMark = () => request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
export const reqSpuImageList = (SpuId: number) => request.get<any, SpuImg>(API.IMAGE_URL + SpuId)
export const reqSpuHasSaleAttr = (SpuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASATTR_URL + SpuId)
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
export const reqAddOrUpdateSpu = (data: SpuData) => {
    //拥有ID说明更新
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}
//添加SKU的请求方法
export const  reqAddSku=(data:SkuData)=>request.post<any,any>(API.ADDSKU_URL,data)
//获取SKU的数组
export const reqSkuList=(spuId:number)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+spuId)
//删除已有的SPU
export const reqRemoveSpu=(spuId:number|string )=>request.delete<any,any>(API.REMOVESPU_URL+spuId)



