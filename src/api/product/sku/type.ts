export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//SKU对象
export interface SkuData {
    id?:number|string,
  category3Id?: string | number,
  spuId?: string | number,
  tmId?: string | number,
  skuName?: string,
  price?: string | number,
  weight?: string | number,
  skuDesc?: string,
  isSale?: boolean|number,
  skuAttrValueList?: [
    {
      attrId: number | string
      valueId: number | string
    },
  ]
  skuSaleAttrValueList?: [
    {
      saleAttrId: number | string
      saleAttrValueId: number | string
    },
  ],
  skuDefaultImg?: string
}
//获取SKU接口返回的数据Ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}
//SKU信息
export interface SkuInfoData extends ResponseData{
    data:SkuData
}
