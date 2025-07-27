//定义小仓库数据state类型
import type { RouteRecordRaw } from 'vue-router'
import type { categoryObj } from '@/api/product/attr/type'
//定义小仓库State类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
  uid: number
  
}
//对应分类仓库state对象的TS类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: categoryObj[]
  c2Id: string | number
  c2Arr: categoryObj[]
  c3Id: string | number
  c3Arr: categoryObj[]
}
