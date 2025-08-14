/**
 * 最后修改时间->2025-08-11 16:40
 * 作者：chenliang
 */
//进行二次封装，请求和响应拦截器
import axios from "axios";
import { ElMessage } from "element-plus";
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'

// 获取环境变量中的服务器地址
// 这里的 import.meta.env.VITE_SERVE 来源于 Vite 的环境变量机制，
// 实际值在根目录下的 .env.development 或 .env.production 文件中配置，
// 例如 VITE_SERVE = 'http://localhost:8080'
const baseURL = import.meta.env.VITE_SERVE || 'http://localhost:8080';

//第一步利用Create方法，创建实例
let request = axios.create({
    //基础路径 - 使用环境变量
    baseURL: baseURL,
    timeout: 5000//超时时间
});

//第二步：request实例添加请求和拦截器,有两个拦截器，使用第一个
request.interceptors.request.use((config) => {
    //获取用户相关的小仓库，获取TOKEN
    //默认内存中有同名的小仓库，择取，否则创建？
    let useStore = useUserStore();
    if (useStore.token) {
        config.headers.token = useStore.token
    }
    //返回配置对象
    //config对象,headers属性请求头。经常给服务器端携带公共参数
    return config;
});

//第三步：响应拦截器，有两个拦截器
request.interceptors.response.use((response) => {
    //成功的回调
    //简化数组
    return response.data;
}, (error) => {
    //失败的回调
    //定义一个变量
    let message = '';
    //http状态码
    let status = error.response.status;
    switch (status) {
        case 401:
            message = 'Token过期'
            break;
        case 403:
            message = '无权访问'
            break;
        case 404:
            message = '请求地址错误'
            break;
        case 500:
            message = '服务器出现问题'
            break;
        default:
            message = '网络出现问题'
            break;
    }
    //提出错误信息
    ElMessage({
        type: 'error',
        message
    });
    return Promise.reject(error);
})
//对外暴露
export default request;
