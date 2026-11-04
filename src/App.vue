<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House, Calendar, ArrowRight, Connection } from '@element-plus/icons-vue'
const route = useRoute()
const activeMenu = computed(() => route.path.startsWith('/events') ? '/events' : '/')
</script>
<template>
  <div class="app-shell">
    <aside class="sidebar">
      <router-link to="/" class="brand"><span class="brand-mark"><el-icon><Connection /></el-icon></span><span>LinkMeet<span class="brand-cn">链荟会务管理</span></span></router-link>
      <div class="nav-caption">工作空间</div>
      <el-menu router :default-active="activeMenu" class="side-menu">
        <el-menu-item index="/"><el-icon><House /></el-icon><span>首页工作台</span></el-menu-item>
        <el-menu-item index="/events"><el-icon><Calendar /></el-icon><span>活动管理</span></el-menu-item>
      </el-menu>
      <div class="sidebar-bottom"><span class="workspace-dot"></span> LinkMeet 工作空间<span class="version">V1.0</span></div>
    </aside>
    <div class="main-shell">
      <header class="topbar"><el-breadcrumb :separator-icon="ArrowRight"><el-breadcrumb-item :to="{ path: '/' }">工作空间</el-breadcrumb-item><el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item></el-breadcrumb><div class="profile"><span class="demo-label">演示空间</span><el-avatar :size="32" class="avatar">荟</el-avatar><span>管理员</span></div></header>
      <main><router-view /></main>
      <footer>LinkMeet 链荟 · 让每一次相聚更有价值 <span>Mock 演示数据 · 刷新后重置</span></footer>
    </div>
  </div>
</template>
