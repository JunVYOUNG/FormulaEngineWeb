<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const isCollapse = ref(false)
    
    const activeRoute = computed(() => {
      return route.path
    })
    
    const toggleMenu = () => {
      isCollapse.value = !isCollapse.value
    }
    
    return {
      activeRoute,
      isCollapse,
      toggleMenu
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-container class="main-container">
      <el-header height="60px">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">公式计算引擎</div>
          </div>
          <el-menu 
            mode="horizontal" 
            router 
            :default-active="activeRoute" 
            class="nav-menu desktop-menu"
            background-color="#1890ff"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/operators">运算符管理</el-menu-item>
            <el-menu-item index="/formulas">公式管理</el-menu-item>
            <el-menu-item index="/calculator">公式计算</el-menu-item>
          </el-menu>
          <div class="mobile-menu-wrapper">
            <el-button class="mobile-menu-btn" @click="toggleMenu" type="text">
              <i class="el-icon-menu"></i>
            </el-button>
          </div>
        </div>
      </el-header>
      
      <!-- 移动端侧边菜单 -->
      <el-drawer v-model="isCollapse" direction="ltr" size="200px" :show-close="false">
        <div class="drawer-header">
          <span class="drawer-title">菜单</span>
          <el-button @click="isCollapse = false" type="text" class="drawer-close">
            <i class="el-icon-close"></i>
          </el-button>
        </div>
        <el-menu 
          router 
          :default-active="activeRoute" 
          class="drawer-menu"
        >
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/operators">
            <i class="el-icon-s-operation"></i>
            <span>运算符管理</span>
          </el-menu-item>
          <el-menu-item index="/formulas">
            <i class="el-icon-document"></i>
            <span>公式管理</span>
          </el-menu-item>
          <el-menu-item index="/calculator">
            <i class="el-icon-s-marketing"></i>
            <span>公式计算</span>
          </el-menu-item>
        </el-menu>
      </el-drawer>
      
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      <el-footer>
        <div class="footer-content">
          公式计算引擎 &copy; {{ new Date().getFullYear() }}
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  height: 100%;
  width: 100%;
}

html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  border: none !important;
}

#app {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: none;
}

.app-container {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0;
  padding: 0;
  border: none;
}

.main-container {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: none;
}

.el-container {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: none;
}

.el-header {
  flex-shrink: 0;
  background-color: #1890ff;
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  line-height: 60px;
  width: 100%;
  border: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: white;
  white-space: nowrap;
  margin-right: 40px;
}

.nav-menu {
  border-bottom: none;
  flex: 1;
}

.el-menu--horizontal {
  border-bottom: none;
}

.el-menu--horizontal > .el-menu-item {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
  font-size: 15px;
  font-weight: 500;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #ffd04b;
  font-weight: bold;
}

.mobile-menu-wrapper {
  display: none;
}

.mobile-menu-btn {
  color: white;
  font-size: 20px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.drawer-title {
  font-weight: bold;
  font-size: 16px;
}

.drawer-close {
  color: #909399;
}

.drawer-menu {
  border-right: none;
}

.el-main {
  flex: 1;
  width: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0;
  border: none;
}

.el-footer {
  flex-shrink: 0;
  background-color: #324057;
  color: #eee;
  text-align: center;
  padding: 20px;
  width: 100%;
  border: none;
}

.footer-content {
  width: 100%;
  margin: 0 auto;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局卡片样式 */
.el-card {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.el-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 全局按钮样式增强 */
.el-button {
  border-radius: 4px;
  font-weight: 500;
}

.el-button--primary {
  background-color: #1890ff;
  border-color: #1890ff;
}

.el-button--primary:hover, .el-button--primary:focus {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* 表格样式增强 */
.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #fafafa;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-bottom: 10px;
}

h1:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #1890ff;
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu-wrapper {
    display: block;
  }
  
  .el-main {
    padding: 15px;
  }
  
  .el-table {
    width: 100%;
    overflow-x: auto;
  }
  
  .header-content {
    padding: 0 15px;
  }

  .logo {
    font-size: 16px;
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 20px;
  }
  
  .el-card {
    margin-bottom: 15px;
  }
}

/* 响应式容器 */
.page-container {
  width: 100%;
  max-width: none;
  padding: 20px;
  margin: 0 auto;
}

@media (min-width: 1200px) {
  .page-container {
    max-width: 1400px;
  }
}
</style>
