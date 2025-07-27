//角色管理模块
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'
//
enum API {
    ALLROSE_URL = '/admin/acl/role/',
    //新增
    ADDROLE_URL = '/admin/acl/role/save',
    //更新
    UPDATEROLE_URL = '/admin/acl/role/update',
    //获取全部的菜单与按钮的数据
    ALLPERMISSTION = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISTION_URL = '/admin/acl/permission/doAssign/?',
    //删除已有的职位
    REMOVEROLE_URL = '/admin/acl/role/remove/',


}
//获取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ALLROSE_URL + `${page}/${limit}/?roleName=${roleName}`)
export const reqAddOrUpdateRole = (data: RoleData) => {
    if (data.id) {
        //更新
        return request.put<any, any>(API.UPDATEROLE_URL, data)
    } else {
        return request.post<any, any>(API.ADDROLE_URL, data)
    }
}
//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) =>
    request.get<any, MenuResponseData>(API.ALLPERMISSTION + roleId)
//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) =>
    request.post(
        API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
    )
//删除已有的职位
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)