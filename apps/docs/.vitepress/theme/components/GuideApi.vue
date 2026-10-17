<script setup lang="ts">
/**
 * 指南页 API 表格渲染（md 页面入口，按 kind 输出单张表）
 * 指南页的 API 数据来自 src/content/<guide>/guide.ts
 */
import { computed } from 'vue';
import type { ComponentMeta } from '../../../src/content/types';
import ApiSection from '../../../src/components/ApiSection.vue';
import { themeGuideApi } from '../../../src/content/theme/guide';
import { i18nGuideApi } from '../../../src/content/i18n/guide';
import { floatingGuideApi } from '../../../src/content/floating/guide';

const props = defineProps<{
  /** 指南标识 */
  guide: 'theme' | 'i18n' | 'floating';
  /** API 分组：methods / types 等 */
  kind: 'props' | 'events' | 'slots' | 'methods' | 'types';
}>();

const API_MAP: Record<typeof props.guide, ComponentMeta['api']> = {
  theme: themeGuideApi,
  i18n: i18nGuideApi,
  floating: floatingGuideApi,
};

const api = computed(() => API_MAP[props.guide]);
</script>

<template>
  <ApiSection v-if="api" :api="api" :kind="kind" />
</template>
