export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,

}
export interface categoryObj {
    id: number | string,
    name: string,
    category1Id?: number,
    category2Id?: number
}
//相应的分类接口返回的对象
export interface CategoryResponseData extends ResponseData {
    data: categoryObj[]
}
//属性值的类型
export interface AttrValue {
    id?: number,
    valueName: string,
    attrId?: number,
    flag?:boolean
}
//存储每个属性值的类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number|string,
    categoryLevel: number,
    attrValueList:AttrValueList

}
//存储每个属性对象的数值的类型
export type AttrList=Attr[]
//属性接口返回的数据类型
export interface AttrResponseData extends ResponseData{
    data:Attr[]
}
