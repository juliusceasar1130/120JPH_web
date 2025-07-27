//引入项目中的全局组件，和课程有区别
import SvgIcon from './SvgIcon/index.vue';
import type { App, Component } from 'vue';
import Category from "./Category/index.vue"
//引入element-plus提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const components: { [name: string]: Component } = { SvgIcon,Category};
export default {
    install(app: App) {
        Object.keys(components).forEach((key: string) => {
            app.component(key, components[key]);
        });
        //注册element-plus,[]是解构
        //将element-plus 提供的全部图标组件 注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
          }
    }
}