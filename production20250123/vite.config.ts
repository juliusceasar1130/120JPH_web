/**
 * 最后修改时间->2025-08-11 16:40
 * 作者：chenliang
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//引入SVG需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
// 这段代码的作用是：
// 使用Vite的defineConfig方法导出配置，支持根据不同的命令（如开发环境serve或生产环境build）和模式（mode）动态生成Vite配置对象。
// 其中，loadEnv函数用于加载指定mode下的环境变量，process.cwd()表示当前项目根目录，便于读取对应的.env文件。
// 这样可以实现根据不同环境（如开发、测试、生产）自动切换配置参数，提高项目的灵活性和可维护性。
// 这里的defineConfig会在Vite项目启动（如运行npm run dev或npm run build）时被Vite自动调用，作为项目的配置入口函数。
// Vite会根据传入的command（如'serve'或'build'）和mode（如'development'、'production'等）参数，执行此函数并获取最终的配置对象。
// 这样可以实现根据不同的运行命令和环境动态生成配置。
export default defineConfig(({ command, mode }) => {
  //获取各个环境下变量，process.cwd()是Env文件地址
  // 这里通过传入的mode参数（如'development'或'production'）来决定读取哪个环境变量文件
  // 例如：mode为'development'时，读取.env.development，mode为'production'时，读取.env.production
  // loadEnv会自动根据mode拼接文件名并加载对应的环境变量
  let env = loadEnv(mode, process.cwd());
  
  return {
    /**
     * 该配置段用于注册Vite项目的核心插件，具体说明如下：
     * 1. vue()：集成Vue 3框架的官方插件，支持.vue文件解析、热更新等功能，是Vue项目的基础插件。
     * 2. createSvgIconsPlugin({...})：用于自动加载和缓存指定目录下的SVG图标文件，便于在项目中通过symbol引用SVG图标。iconDirs指定SVG图标目录，symbolId定义生成的symbol唯一标识格式。
     * 3. viteMockServe({...})：集成本地Mock服务插件，mockPath指定Mock数据文件目录，enable根据当前命令（仅在开发环境serve时启用）决定是否启用Mock服务，便于前端独立开发和联调。
     * 该插件数组确保了开发环境下的高效开发体验和SVG图标的统一管理。
     */
    plugins: [
      // 这是标准写法，vue() 是官方 @vitejs/plugin-vue 插件的默认用法
      // 引用自 import vue from '@vitejs/plugin-vue'
      vue(),
      createSvgIconsPlugin({
        // 指定要缓存的SVG图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式，便于全局唯一引用
        // symbolId用于定义生成的SVG symbol的唯一ID格式
        // 这里的'icon-[dir]-[name]'会将每个SVG文件生成一个symbol，ID格式为'icon-目录名-文件名'
        // 这样在项目中引用SVG图标时，可以通过<svg><use xlink:href="#icon-xxx-yyy"></use></svg>的方式唯一定位到对应的图标
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        // mock数据文件目录
        mockPath: 'mock',
        // 仅在开发环境（serve命令）下启用mock
        enable: command === 'serve',
      })
    ],
    // resolve配置项用于自定义模块解析方式
    // 主要作用：
    // 1. 配置路径别名（alias），简化import路径书写，提高开发效率
    // 2. 指定扩展名自动解析（extensions），可省略文件后缀
    // 3. 配置模块查找目录（modules），自定义依赖查找顺序
    // 4. 支持条件导入、包重定向等高级用法
    // 在本项目中，常用的是alias配置，将"@"映射到src目录，方便全局引用
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    //scss全局变量配置
    /**
     * css配置项用于设置全局样式预处理器选项
     * 主要作用：
     * 1. preprocessorOptions：为不同的样式预处理器（如scss、less等）单独配置参数
     * 2. 这里配置了scss，表示对所有scss文件生效
     *    - javascriptEnabled: true 允许在scss中使用js表达式（兼容性考虑，部分场景需要）
     *    - additionalData: '@import "./src/styles/variable.scss";' 表示在每个scss文件前自动引入全局变量文件，无需每次手动import
     * 这样可以保证全局样式变量、mixin等在所有scss文件中都可用，提升开发效率和样式一致性
     */
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 构建配置
    build: {
      // outDir: 'dist' 表示构建产物（打包后的文件）输出到 dist 目录
      // assetsDir: 'assets' 表示静态资源（如图片、字体、js、css等）统一放在 dist/assets 目录下
      outDir: 'dist',
      assetsDir: 'assets',
      // 生产环境移除 console
      /**
       * terserOptions配置项用于自定义生产环境下的代码压缩行为
       * 主要作用：
       * - compress.drop_console: 在生产环境（mode === 'production'）下移除所有console语句，减少无用日志，优化包体积和安全性
       * - compress.drop_debugger: 在生产环境下移除所有debugger语句，防止调试代码泄露到线上
       * 这样可以确保最终打包上线的代码更加精简、专业，避免调试信息暴露
       */
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // 分包策略
      // 这段配置是Vite中build.rollupOptions的设置，主要用于自定义打包输出的文件结构和分包策略。
      // 具体作用如下：
      // 1. output.chunkFileNames/entryFileNames/assetFileNames：自定义打包后js、入口js、静态资源（如图片、字体等）的输出目录和文件名格式，便于资源管理和缓存优化。
      // 2. manualChunks：手动拆分代码包，将常用的依赖库（如vue、element-plus、echarts、axios等）单独打成独立的chunk，实现更高效的浏览器缓存和按需加载，提升首屏加载速度和后续页面切换性能。
      //    - vue: 将vue、vue-router、pinia相关依赖打包到一个chunk
      //    - elementPlus: 将element-plus及其图标库打包到一个chunk
      //    - echarts: 将echarts单独打包
      //    - utils: 将axios、lodash、moment等工具库单独打包
      // 这样做可以让主业务代码和第三方依赖分离，减少重复加载，提升整体性能和可维护性。
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            elementPlus: ['element-plus', '@element-plus/icons-vue'],
            echarts: ['echarts'],
            utils: ['axios', 'lodash', 'moment']
          }
        }
      }
    },
    //代理跨域服务器（仅开发环境）
    /**
     * 这段配置是Vite开发服务器（dev server）的相关设置，主要作用如下：
     * 
     * 1. host: '0.0.0.0'
     *    - 允许本地局域网内其他设备访问本地开发服务器，便于多端调试。
     * 
     * 2. port: 3000
     *    - 指定开发服务器启动时监听的端口号为3000。
     * 
     * 3. open: true
     *    - 启动开发服务器后自动打开默认浏览器，提升开发效率。
     * 
     * 4. proxy
     *    - 配置本地开发环境的API代理，解决前端本地开发时的跨域问题。
     *    - [env.VITE_APP_BASE_API]：动态读取环境变量，作为需要代理的API前缀（如 /api）。
     *    - target: 指定后端服务器地址（优先取环境变量VITE_SERVE，否则为 http://localhost:8080）。
     *    - changeOrigin: true 表示代理时会修改请求头中的origin，伪装成目标服务器来源，解决跨域。
     *    - rewrite: (path) => path.replace(/^\/api/, '') 表示将请求路径中的 /api 前缀去掉再转发到后端，保证后端接口路径正确。
     * 
     * 总结：该配置实现了前端本地开发时的API请求自动代理到后端服务器，避免跨域问题，并支持灵活的服务器地址和API前缀配置，提升开发体验和效率。
     */
    /**
     * server 配置仅在开发环境（dev 模式）下生效。
     * 生产环境（build 后）不会启用该配置，生产环境由后端服务器或 Nginx 代理处理跨域等问题。
     * 详见官方文档：https://cn.vitejs.dev/config/server-options.html
     */
    server: {
      host: '0.0.0.0',
      // port: 3000 表示开发服务器启动时监听的端口号为3000
      // 你可以通过 http://localhost:3000 或 http://本机IP:3000 访问本地开发环境
      // 如需修改端口号，可将3000改为其他未被占用的端口
      port: 3000,
      open: true,
      proxy: {
        // 该配置项的含义：以环境变量 VITE_APP_BASE_API（如 /api）为key，设置对应的代理规则
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE || 'http://localhost:8080',
          /**
           * changeOrigin: true 的作用详解：
           * 
           * 1. 代理请求（Proxy Request）：
           *    - 代理请求是指前端开发时，开发服务器（如Vite）代替浏览器向后端服务器转发API请求。
           *    - 这样做可以让前端本地代码像在真实后端环境下一样访问接口，避免本地和后端接口地址不一致带来的问题。
           * 
           * 2. 目标服务器（Target Server）：
           *    - 目标服务器指的是实际提供API服务的后端服务器（如Java、Node、Python等后端服务）。
           *    - 代理配置中的 target 字段就是目标服务器的地址，前端请求会被转发到这里。
           * 
           * 3. 跨域（Cross-Origin）：
           *    - 跨域是指浏览器出于安全考虑，阻止网页从一个域（协议+域名+端口）去请求另一个域的数据。
           *    - 例如：前端本地开发环境 http://localhost:3000 访问后端 http://localhost:8080 就属于跨域。
           * 
           * 4. 为什么要解决跨域问题？
           *    - 前端本地开发时，接口请求会因为跨域被浏览器拦截，导致无法正常调试和开发。
           *    - 通过代理请求，开发服务器代替浏览器向目标服务器发起请求，并将响应返回给前端，绕过浏览器的跨域限制。
           * 
           * 5. changeOrigin: true 的作用：
           *    - 在代理请求时，将请求头中的 origin 字段修改为目标服务器的地址。
           *    - 这样目标服务器会认为请求是直接来自于自己，避免因来源不同而拒绝请求，从而解决跨域问题。
           */
          changeOrigin: true,
          // /api 前缀是在开发环境下由前端代码中统一配置的，通常通过接口请求工具（如 axios 封装）或 API 配置文件自动拼接到每个接口请求的路径前面。
          // 这样做的目的是便于本地开发时通过 Vite 的代理功能自动将所有以 /api 开头的请求转发到后端服务器，实现无感知的跨域处理。
          // 在生产环境下，通常由后端服务器或 Nginx 代理处理，无需前端手动加前缀。
          // 具体实现可参考 src/utils/request.ts 或 API 封装相关代码。
          // 1. 统一接口调用入口：前端所有API请求都以 /api 作为前缀（如 /api/user/list），便于管理和区分静态资源与接口请求。
          // 2. 便于本地开发代理：通过Vite的代理配置，将所有以 /api 开头的请求自动转发到后端服务器，解决跨域问题。
          // 3. 环境切换灵活：只需修改代理规则，无需修改前端代码中的接口路径，方便开发、测试和生产环境的切换。
          // 4. 后端接口路径保持纯净：代理时会去掉 /api 前缀，后端无需关心前缀，接口路径与生产环境一致，减少部署和维护成本。
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
