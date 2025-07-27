export interface ResponseData {
    code: string,
    message: string,
    ok: boolean
}
export interface SpuData {
    id?: number|string,
    spuName: string,
    description: string,
    category3Id: string | number,
    tmId: number|string,//品牌ID
    spuSaleAttrList: null|SaleAttr[],//销售属性
    spuImageList: null|SpuImg[]//图片

}
export type Records = SpuData[]
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        searchCount: boolean,
        size: number,
        total: number,
        current: number,
        pages: number
    }
}
//所有品牌类型的TS
export interface TradeMark {
    id: number,
    tmName: string,
    logoUrl: string
}
//品牌接口返回的类型
export interface AllTradeMark extends ResponseData {
    data: TradeMark[]
}
//商品图片的
export interface SpuImg {
    id?: number,
    spuId: number,
    imgName?: string,
    imgUrl?: string,
    name?:string,
    url?:string,
    response?:object|string//测试
}
//
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}
//已有销售属性值对象
export interface SaleAttrValue {
    id?: string,
    spuId?: number,
    baseSaleAttrId: number|string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: boolean
}
//
export type spuSaleAttrValueList = SaleAttrValue[]
export interface SaleAttr {
    id?: string,
    spuId?: number,
    baseSaleAttrId: number|string,
    saleAttrName: string,
    spuSaleAttrValueList: spuSaleAttrValueList
    flag?:boolean,//点击事件
    saleAttrValue?: string, //临时存储新增的属性值
}

//SPU已有销售属性接口返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}
//以后全部SPU返回类型
export interface HasSaleAttr{
    id:number,
    name:string
}
export interface HasSaleAttrResponseData extends ResponseData{
    data: HasSaleAttr[]
}
//SKU
export interface SkuData{
    category3Id: string|number,
    spuId:string|number,
    tmId: string|number,
    skuName:string,
    price:string|number,
    weight:string|number,
    skuDesc:string,
    skuAttrValueList:[{
        attrId: number|string ,
        valueId: number|string,
    }]
    skuSaleAttrValueList:[{
        saleAttrId: number|string,
        saleAttrValueId: number|string,
    }]
    skuDefaultImg: string ,  
}
//获取sku数据的接口类型
export interface SkuInfoData extends ResponseData {
    data:SkuData[]

}