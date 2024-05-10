//小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'
let useLayOutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,//用户控制菜单是否折叠
            refsh:false//用于刷新效果
        }
    }
})
export default useLayOutSettingStore