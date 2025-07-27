//创建用户相关小仓库
import { defineStore } from 'pinia'
//引入登录函数
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入数据类型
// import type { loginForm, loginResponseData } from '@/api/user/type';
import type {
    loginFromData,
    loginResponseData,
    userResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由（常量路由）
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
//引入深拷贝
// import cloneDeep from 'lodash/cloneDeep'
// import router from '@/router'
//用于过滤展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                //硅谷333账号:product\trademark\attr\sku
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}

//创建用户小仓库

let useUserStore = defineStore('User', {
    //存储数据地方
    state: (): UserState => {
        return {
            //用户的唯一标识,持久化存储
            token: GET_TOKEN(), //一刷新，一调取就赋值，重要！
            //存储路由
            menuRoutes: constantRoute, //仓库存储菜单需要数组（路由）
            username: '',
            //存储当前用户是否包含某一个按钮
            buttons: [],
            avatar: '',
            uid: 0,
            
        }
    },
    actions: {
        //用户登录的方法
        async userLogin(data: loginFromData) {
            //promise对象，await 则获得response
            let result: loginResponseData = await reqLogin(data)
            
            //登录成功：200->token
            //登录失败:201->登录失败错误的信息
            if (result.code == 200) {
                //通过Pinia存储token;
                //由于pinia/VUEX存储数据其实利用js对象
                this.token = result.data as string
                
                console.log('小仓库中的token:' + this.token)

                //本地存储持久化数据或者用cookie
                SET_TOKEN(result.data as string)
                // localStorage.setItem("TOKEN", (result.data.token as string))
                //保证当前async函数返回一个成功的promise
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data.message))
            }
        },
        //获取用户信息方法，返回promise对象
        async userInfo() {
            let result: userResponseData = await reqUserInfo()
            //获取信息成功
            if (result.code == 200) {
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons = result.data.buttons;
                this.uid = result.data.id;
               
                //计算当前用户需要的异步路由(深拷贝，防止直接修改原始数据)
                //let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
                //菜单的需要的数据整理完毕,返回主页不刷新的话，异步路由还是保存在仓库中
                //this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
                
                //目前路由器管理的只有常量路由，异步路由和任意路由动态追加注册
                // [...userAsyncRoute, ...anyRoute].forEach((route: any) => {
                //     router.addRoute(route)
                // })
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        //退出用户登录
        async userLogout() {
            this.username = '';
            this.avatar = '';
            this.token = '';
            REMOVE_TOKEN();
            // let result: any = await reqLogout()
            // if (result.code == 200) {
            //     //目前没有接口通知服务器token失效，本次简化
            //     this.username = ''
            //     this.avatar = ''
            //     this.token = ''
            //     REMOVE_TOKEN()
            //     result = 'ok'
            // } else {
            //     Promise.reject(new Error(result.message))
            // }
        },
    },
    getters: {},
})
export default useUserStore
