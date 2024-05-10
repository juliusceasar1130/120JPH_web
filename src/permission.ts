//路由健全，路由能不能被访问的设置
import router from '@/router'
//组件报错没有问题
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//获取用户小仓库，判断是否登录成功
nprogress.configure({ showSpinner: false })
import pinia from './store'
//main.ts同级事先要引入大仓库
import useUserStore from './store/modules/user'
let userStore = useUserStore(pinia);
import setting from './setting'

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = setting.title + '-' + to.meta.title
    // 方位某一个路由前的守卫
    nprogress.start();
    //判断用户是否登录
    let token = userStore.token

    if (token) {
        //登录成功，不能访问login，指向首页
        if (to.path == '/login') {
            next({ path: '/home' })
        } else {
            //登录成功，运行访问其他页面
            //页面刷新后，username会消失，只可能存在token（持久赋值）需要重新获取用户信息
            //有用户信息
            if (userStore.username) {

                next();
            } else {
                //获取用户信息
                try {
                    //获取用户信息后放行

                    await userStore.userInfo();
                    //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
                    //需要等待异步路由加载完毕后，再放行

                    next({ ...to })
                } catch (error) {
                    //没有获取到用户信息
                    //用户手动修改了本地存储token
                    //退出登录->用户相关信息清空
                    //token过期(这个功能尚未完成)
                    await userStore.userLogout();
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }

    } else {
        console.log('token没有')
        //用户未登录判断,把想去的PATH暂存下来
        if (to.path == '/login') { next() } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})
//N1任意路由实现进度条---nprogress
//N2路由鉴权（路由访问权限设置）
//全部路由组件：登录、404、任意路由、首页、数据大屏、权限（三个子路由）、商品管理（4个子路由）
//用户未登录，可以访问未登录
//登录成功，不可以访问Login(指向首页)，其余可以访问