<template>
  <div class="layout_container">
    <menu></menu>
    <!--左侧菜单-->
    <!-- ******************************************************************************* -->
    <div class="layout_slider" :class="{fold:LayOutSettingStore.fold? true : false}">
      <!-- *************************************************************************************** -->
      <Logo></Logo>
      <!--展示菜单-->
      <!--滚动组件-->
      <el-scrollbar class="scrollbar">
        <!--菜单组件-->
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          background-color="#001529"
          text-color="white"
          active-text-color="yellowgreen"
          :default-active="$router.path"
        >
          <!--根据路由动态生成菜单-->
          <Menu :menulist="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>
    <!--内容展示区-->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }"    >
      <Main></Main>
    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from './logo/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
//获取用户相关的小仓库,为了生成菜单
import useUserStore from '@/store/modules/user'
//引入layout小仓库
import useLayOutSettingStore from '@/store/modules/setting'
//引入主展示区
import Main from './main/index.vue'
//获取路由对象
import { useRoute } from 'vue-router'
//引入顶部TABBAR组件
import Tabbar from './tabbar/index.vue'
//获取当前
let $router = useRoute()
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
</script>
<script lang="ts">
//给组件取名字
export default {
  name: 'Layout',
}
</script>
<style scoped lang="scss">
.layout_container {
  //需要增加，否则会有空白边
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  .layout_slider {
  width: $base-menu-width;
  height: 100vh;
  background: $base-menu-background;
  transition: all 0.3s;

  .scrollbar {
    width: 100%;
    height: calc(100vh - $base-menu-logo-height);

    .el-menu {
      border-right: none;
    }
  }
  &.fold {
    width: $base-menu-min-width;
  }
}
.layout_tabbar {
  position: fixed;
  top: 0px;
  left: $base-menu-width;
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;
  transition: all 0.3s;
  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}

.layout_main {
  position: absolute;
  left: $base-menu-width;
  top: $base-tabbar-height; 
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-height);
  padding: 20px;
  overflow: auto;
  transition: all 0.3s;
  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}
}
</style>
