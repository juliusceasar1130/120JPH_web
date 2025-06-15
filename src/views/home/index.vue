<!--
最后修改时间->2025-03-22 14:04
-->
<template>
  <div class="home-container">
    <div class="welcome-section">
      <!-- <h1 class="welcome-title">系统功能导航</h1>
      <p class="welcome-subtitle">请选择您要访问的功能模块</p> -->
    </div>

    <div class="navigation-grid">
      <!-- 质量管理 -->
      <div class="menu-card">
        <div class="card-header">
          <el-icon><Goods /></el-icon>
          <h2>质量管理</h2>
        </div>
        <div class="card-content">
          <router-link to="/quality/rp2" class="menu-item">
            <el-icon><Picture /></el-icon>
            <span>门槛二线</span>
          </router-link>
          <router-link to="/quality/rp3" class="menu-item">
            <el-icon><Picture /></el-icon>
            <span>门槛三线</span>
          </router-link>
        </div>
      </div>

      <!-- 变化点管理 -->
      <div class="menu-card">
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <h2>变化点管理</h2>
        </div>
        <div class="card-content">
          <router-link to="/cp/info" class="menu-item">
            <el-icon><House /></el-icon>
            <span>变化点管理</span>
          </router-link>
          <router-link to="/cp/trace" class="menu-item">
            <el-icon><Message /></el-icon>
            <span>追溯</span>
          </router-link>
          <router-link to="/cp/map" class="menu-item">
            <el-icon><Tools /></el-icon>
            <span>点位</span>
          </router-link>
        </div>
      </div>

      <!-- 数据分析 -->
      <div class="menu-card">
        <div class="card-header">
          <el-icon><Monitor /></el-icon>
          <h2>数据分析</h2>
        </div>
        <div class="card-content">
          <router-link to="/data/defectsAna" class="menu-item">
            <el-icon><Monitor /></el-icon>
            <span>缺陷数据分析</span>
          </router-link>
          <router-link to="/data/eines" class="menu-item">
            <el-icon><Stopwatch /></el-icon>
            <span>Eines</span>
          </router-link>
        </div>
      </div>

      <!-- 项目车跟踪 -->
      <div class="menu-card">
        <div class="card-header">
          <el-icon><Location /></el-icon>
          <h2>项目车跟踪</h2>
        </div>
        <div class="card-content">
          <router-link to="/bodytrack/home" class="menu-item">
            <el-icon><Guide /></el-icon>
            <span>Home</span>
          </router-link>
          <router-link to="/bodytrack/top" class="menu-item">
            <el-icon><Guide /></el-icon>
            <span>Top</span>
          </router-link>
        </div>
      </div>

      <!-- 权限管理 -->
      <div class="menu-card">
        <div class="card-header">
          <el-icon><Lock /></el-icon>
          <h2>权限管理</h2>
        </div>
        <div class="card-content">
          <router-link to="/acl/user" class="menu-item">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </router-link>
          <router-link to="/acl/role" class="menu-item">
            <el-icon><UserFilled /></el-icon>
            <span>角色管理</span>
          </router-link>
          <router-link to="/acl/permission" class="menu-item">
            <el-icon><Histogram /></el-icon>
            <span>菜单管理</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
//引入组合式API函数生命周期函数
import { onMounted } from 'vue';
import useUserStore from '@/store/modules/user';
import { 
  Goods, 
  Picture, 
  Warning, 
  House, 
  Message, 
  Tools, 
  Monitor, 
  Stopwatch, 
  Location, 
  Guide, 
  Lock, 
  User, 
  UserFilled, 
  Histogram 
} from '@element-plus/icons-vue';

let userStore = useUserStore();
onMounted(() => {
  //首页挂载完毕，发送获取用户信息
  userStore.userInfo();
});
</script>
  
<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 32px;
  color: #303133;
  margin-bottom: 10px;
  font-weight: 600;
}

.welcome-subtitle {
  font-size: 16px;
  color: #606266;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.menu-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #607d8b 0%, #78909c 100%);
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header .el-icon {
  font-size: 24px;
  margin-right: 12px;
  color: #ffffff;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.card-content {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 16px 10px;
  border-radius: 8px;
  background-color: #f9fafc;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #ecf5ff;
  transform: scale(1.05);
}

.menu-item .el-icon {
  font-size: 28px;
  margin-bottom: 10px;
  color: #606266;
  transition: all 0.3s ease;
}

.menu-item span {
  font-size: 14px;
  color: #606266;
  transition: all 0.3s ease;
}

.menu-item:hover .el-icon,
.menu-item:hover span {
  color: #409eff;
}

@media screen and (max-width: 768px) {
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .card-content {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
  
  .welcome-title {
    font-size: 28px;
  }
}
</style>