<script setup lang="ts">
import SideNav from './components/SideNav.vue';
</script>

<template>
  <div class="docs-app">
    <SideNav />
    <main class="docs-main">
      <!-- key 绑定完整路径：切组件页时强制重建，避免 DemoBlock 复用导致
           Vue/React tab 状态与 React createRoot 实例残留（显示成上一个组件的 demo） -->
      <RouterView :key="$route.fullPath" />
    </main>
  </div>
</template>
