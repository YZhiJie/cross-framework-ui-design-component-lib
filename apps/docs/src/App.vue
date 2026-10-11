<script setup lang="ts">
import SideNav from './components/SideNav.vue';
</script>

<template>
  <div class="docs-app">
    <SideNav />
    <main class="docs-main">
      <RouterView />
    </main>
  </div>
</template>
