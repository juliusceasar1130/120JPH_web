import request from '@/utils/request'
import type { userResponseData,User,AllRoleResponseData,SetRoleData } from './type'
enum API {
    //获取全部已有用户信息
    ALLUSER_URL = '/admin/acl/user/',
    //新增用户
    ADDUSER_URL='/admin/acl/user/save',
    UPDATEUSER_URL='/admin/acl/user/update',
    //获取全部职位和当前职位的接口
    ALLROLEURL='/admin/acl/user/toAssign/',
    //已有的用户分配职位
    SETROLE_URL='/admin/acl/user/doAssignRole/',
    //删除某个账号
    DELETEUSER_URL='/admin/acl/user/remove/',
    //批量删除
    DELETEUSERBATCH_URL='/admin/acl/user/batchRemove',
    //搜索用户


}
export const reqUserInfo = (page:number, limit:number,username:string) => request.get<any, userResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
export const reqAddOrUpdateUser=(data:User)=>{
    if(data.id){
        //存在ID为修改
        return request.put<any,any>(API.UPDATEUSER_URL,data)
    }else{
        //新增
        return request.post<any,any>(API.ADDUSER_URL,data)
    }
}
//获取全部职位和当前用户的包含职位
export const reqAllRoleById=(userId:number)=>request.get<any,AllRoleResponseData>(API.ALLROLEURL+userId)
export const reqSetUserRole=(data:SetRoleData)=>request.post(API.SETROLE_URL,data)
export const reqRemoveUser=(userId:number)=>request.delete<any,any>(API.DELETEUSER_URL+userId)
export const reqRemoveBatchUser=(idlist:number[])=>request.delete<any,any>(API.DELETEUSERBATCH_URL,{data:idlist})