<script setup lang="ts">
/**
 * 自定义布局壳：完全沿用默认主题布局，只做两件事
 * - layout-top：LocaleSync（渲染零内容，仅负责把 VitePress 路由语言同步进 i18n 模块）
 * - 主题联动：监听 VP 的 isDark（内置导航栏明暗开关驱动）写入组件库 data-theme，
 *   保证 demo 组件的语义 token 与文档主题实时同步
 */
import { watch } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { setTheme } from '@xui-design/vue';
import LocaleSync from './components/LocaleSync.vue';

const { isDark } = useData();

watch(isDark, (dark) => setTheme(dark ? 'dark' : 'light'), { immediate: true });
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top><LocaleSync /></template>
  </DefaultTheme.Layout>
</template>
