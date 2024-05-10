<template>
    <el-button
      size="small"
      circle
      icon="Refresh"
      @click="updateRefsh"
    ></el-button>
    <el-button
      size="small"
      circle
      icon="FullScreen"
      @click="FullScreen"
    ></el-button>
    <el-button size="small" circle icon="Setting"></el-button>
    <img
      :src="useStore.avatar"
      alt=""
      style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
      v-if="flagReflesh"
    />
    <!--下拉菜单-->
    <el-dropdown :hide-on-click="false">
      <span class="el-dropdown-link">
        {{ useStore.username }}
        <el-icon class="el-icon-right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="userDetail">用户详情</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  
    <el-dialog
      v-model="dialogVisible"
      title="用户详情"
      width="700"
      draggable
      append-to-body
    >
      <el-form>
        <el-form-item>
          <el-input type="text" disabled v-model="useStore.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            :action="setting.avatar_upload_path"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDiag">取消</el-button>
          <el-button type="primary" @click="saveDiag">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  <script setup lang="ts">
  //引入layout小仓库
  import useLayOutSettingStore from '@/store/modules/setting'
  import { ref, nextTick } from 'vue'
  import { reqUserUpdateById } from '@/api/user/index'
  import { ElMessage } from 'element-plus'
  //获取用户相关小仓库
  import useUserStore from '@/store/modules/user'
  import { useRouter, useRoute } from 'vue-router'
  //配置文件
  import setting from '@/setting'
  let $router = useRouter()
  let $route = useRoute()
  let useStore = useUserStore()
  let LayOutSettingStore = useLayOutSettingStore()
  //控制对话框的显示隐藏
  let dialogVisible = ref<boolean>(false)
  //头像地址
  let imageUrl = ref()
  //图片是否载入新的
  let flag = ref(false)
  //图片销毁重载
  let flagReflesh = ref(true)
  
  //刷新页面
  const updateRefsh = () => {
    LayOutSettingStore.refsh = !LayOutSettingStore.refsh
  }
  //全屏回调
  const FullScreen = () => {
    //DOM对象一个属性
    let full = document.fullscreenElement
    if (!full) {
      document.documentElement.requestFullscreen()
    } else {
      //退出全屏
      document.exitFullscreen()
    }
  }
  //退出登录回调
  const logout = async () => {
    //s1:向服务器发送请求（本案例没有这个接口）
    //s2:仓库中用户数据清空，名字头像token等
    //s3:跳转登录页面
    await useStore.userLogout()
    $router.push({ path: '/login', query: { redirect: $route.path } })
  }
  const userDetail = () => {
    imageUrl.value = ''
    imageUrl.value = useStore.avatar
    dialogVisible.value = true
  }
  const closeDiag = () => {
    dialogVisible.value = false
  }
  
  //头像上传成功
  const handleAvatarSuccess = (info: any) => {
    //预览显示，在内存
    imageUrl.value = info.data
    // 图片载入新的标记，决定是否发生更新请求
    flag.value = true
  }
  
  //确定保存图片
  const saveDiag = async () => {
    //收集信息头像路径
    let data = { avatar: imageUrl.value }
    //载入新图标，则发送请求，否则没必要发送
    if (flag.value) {
      let result = await reqUserUpdateById(useStore.uid, data)
      if (result.code == 200) {
        ElMessage({
          type: 'success',
          message: '更新成功',
        })
        //刷新显示
        dialogVisible.value = false
        flag.value = false
        //图片刷新
        flagReflesh.value = false
        //更新userStore
        useStore.userInfo()
        nextTick(() => {
        flagReflesh.value = true
        })
      }
    }
    //最后关闭对话框
    dialogVisible.value = false
  }
  
  //图片上传之前的限制，钩子在图片上传之前
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
    //要求：png|jpg|gif 4M
    if (
      rawFile.type == 'image/png' ||
      rawFile.type == 'image/jpeg' ||
      rawFile.type == 'image/gif'
    ) {
      if (rawFile.size / 1024 / 1024 < 4) {
        return true
      } else {
        ElMessage({
          type: 'error',
          message: '上传的文件大小应该小于4M',
        })
        return false
      }
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件格式不正确',
      })
      return false
    }
  }
  </script>
  
  <script lang="ts">
  //给组件取名字
  export default {
    name: 'Setting',
  }
  </script>
  
  <style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
  
  <style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  </style>
  