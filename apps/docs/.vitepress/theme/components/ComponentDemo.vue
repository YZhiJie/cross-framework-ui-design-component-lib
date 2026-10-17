<script setup lang="ts">
/**
 * 组件单条 demo 渲染（md 页面入口）
 *
 * md 生成器把 demo 标题 / 说明写成 markdown（h3 归入目录、文本可被搜索索引），
 * 交互区（Vue / React 双 tab 实时挂载 + 源码）由本组件按 slug + demoId 查找渲染。
 */
import { computed } from 'vue';
import { componentMetaMap } from '../../../src/content/registry';
import DemoBlock from '../../../src/components/DemoBlock.vue';

const props = defineProps<{
  /** 组件路由 slug（如 button） */
  slug: string;
  /** demo 唯一 id（meta.demos[].id） */
  demoId: string;
}>();

const demo = computed(() =>
  componentMetaMap.get(props.slug)?.demos.find((item) => item.id === props.demoId),
);
</script>

<template>
  <DemoBlock v-if="demo" :demo="demo" />
</template>
