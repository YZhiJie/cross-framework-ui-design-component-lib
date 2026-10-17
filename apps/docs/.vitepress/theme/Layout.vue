<script setup lang="ts">
/**
 * 自定义布局壳：完全沿用默认主题布局，只挂两个扩展点
 * - layout-top：LocaleSync（渲染零内容，仅负责把 VitePress 路由语言同步进 i18n 模块）
 * - nav-bar-content-after：三态主题切换控件（明亮 / 暗黑 / 跟随系统）
 */
import DefaultTheme from 'vitepress/theme';
import LocaleSync from './components/LocaleSync.vue';
import ThemeModeToggle from './components/ThemeModeToggle.vue';
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top><LocaleSync /></template>
    <template #nav-bar-content-after><ThemeModeToggle /></template>
  </DefaultTheme.Layout>
</template>
