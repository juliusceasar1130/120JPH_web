import { createApp } from "vue"
import "./style.css"
import App from "@/App.vue"
//安装ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


//忽略类型检测，消除红色线
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
import globalComponent from '@/components/index'
//注册SCSS样式
import '@/styles/index.scss'
//引入路由
import router from "./router"
//引入pinia
import pinia from "./store"
import './permission'
import { isHasButton } from '@/directive/has'

const app = createApp(App)
//SVG使用的图标
app.use(ElementPlus, {
    locale: zhCn
})
//注册组件
app.use(globalComponent);
//注册路由
app.use(router);
//安装大仓库
app.use(pinia);
//引入自定义指令文件
isHasButton(app)

//测试假接口
// import axios from 'axios';
// //denglv
// axios({
//     url: '/api/user/login',
//     method: 'post',
//     data: {
//         username: 'admin',
//         password: '111111'
//     }
// })

app.mount("#app")
