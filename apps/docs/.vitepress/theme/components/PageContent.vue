<script setup lang="ts">
/**
 * 页面内容过渡层：覆盖 VitePress 全局 Content 组件
 *
 * Content 以 relativePath 为 key，路由切换时旧页淡出、新页淡入；
 * mode="out-in" 保证过渡期间无双页重叠抖动。
 */
import { Content, useData } from 'vitepress';

const { page } = useData();
</script>

<template>
  <Transition name="xui-page" mode="out-in">
    <Content :key="page.relativePath" />
  </Transition>
</template>
