//
import request from '@/utils/request'
import type { SkuInfoData, SkuResponseData } from './type'
//
enum API{
    //已有商品的SKU
    SKU_URL='/admin/product/list/',    
    //产品上架
    SALE_URL='/admin/product/onSale/',
    //产品下架
    CancelSALE_URL='/admin/product/cancelSale/',
    //产品信息
    SKUINFO_URL='/admin/product/getSkuInfo/',
    //删除产品
    remove_URL='/admin/product/deleteSku/',

    }

//
export const reqSkuList=(page:number,limit:number)=>request.get<any,SkuResponseData>(API.SKU_URL+`${page}/${limit}`)
export const reqSaleSku=(skuId:number)=>request.get<any,any>(API.SALE_URL+skuId)
export const reqCancelSku=(skuId:number)=>request.get<any,any>(API.CancelSALE_URL+skuId)
export const reqSkuInfo=(skuId:number)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+skuId)
export const reqRemoveSku=(skuId:number)=>request.delete<any,any>(API.remove_URL+skuId);
