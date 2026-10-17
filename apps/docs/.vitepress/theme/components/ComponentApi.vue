<script setup lang="ts">
/**
 * 组件 API 表格渲染（md 页面入口，按 kind 输出单张表）
 *
 * md 生成器为每个存在的 API 分组写一个 h3 + 本组件，kind 与 meta.api 的
 * 分组键一一对应；数据仍以 meta.ts 为单一来源。
 */
import { computed } from 'vue';
import { componentMetaMap } from '../../../src/content/registry';
import ApiSection from '../../../src/components/ApiSection.vue';

const props = defineProps<{
  /** 组件路由 slug（如 button） */
  slug: string;
  /** API 分组：props / events / slots / methods / types */
  kind: 'props' | 'events' | 'slots' | 'methods' | 'types';
}>();

const meta = computed(() => componentMetaMap.get(props.slug));
</script>

<template>
  <ApiSection v-if="meta" :api="meta.api" :kind="kind" />
</template>
