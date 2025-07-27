//封装本地存储数据与读取数据的方法
export const SET_TOKEN = (token: string) => {
    localStorage.setItem("token", token)
}
//获取本地数据
export const GET_TOKEN = () => {
    return localStorage.getItem("token")
}
//本地数据删除
export const REMOVE_TOKEN=()=>{localStorage.removeItem('token');}
