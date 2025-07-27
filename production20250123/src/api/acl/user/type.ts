//用户账号的信息
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

export interface User {
    id?: number
    createTime?: string
    updateTime?: string
    username?: string
    password?: string
    name?: string
    phone: string
    roleName: string
}
export type Records = User[];
export interface userResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number
    }
}
//一个职位的类型
export interface RoleData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark: string,
}
export type AllRole = RoleData[];
export interface AllRoleResponseData extends ResponseData {
    data: {
        assignRoles: AllRole,
        allRolesList: AllRole,
    }
}
//给用户分配角色的参数收集
export interface SetRoleData {
    roleIdList: number[],
    userId: number,
}
