import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//引入SVG需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取各个环境下变量process.cwd()是Env文件地址
  let env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue(),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      localEnabled: command === 'serve',
    })
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域服务器
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取服务器地址的设置
          target: 'http://172.22.44.99:8080/',//'http://localhost:8080/'
          //env.VITE_SERVE
          //是否代理跨域？需要
          changeOrigin: true,
          //路径重写取消/API
          rewrite: (path) => path.replace(/^\/api/, '')

        }
      }
    }
  }
})
