<script setup lang="ts">
/**
 * 指南页单条 demo 渲染（md 页面入口）
 *
 * 指南页（主题定制 / 国际化 / 浮层避让）的 demo 与组件文档页同构：
 * md 生成器写标题 / 说明，本组件按 guide + demoId 查找并渲染 DemoBlock。
 */
import { computed } from 'vue';
import type { DemoDefinition } from '../../../src/content/types';
import DemoBlock from '../../../src/components/DemoBlock.vue';
import { themeGuideDemos } from '../../../src/content/theme/guide';
import { i18nGuideDemos } from '../../../src/content/i18n/guide';
import { floatingGuideDemos } from '../../../src/content/floating/guide';

const props = defineProps<{
  /** 指南标识 */
  guide: 'theme' | 'i18n' | 'floating';
  /** demo 唯一 id */
  demoId: string;
}>();

const DEMOS_MAP: Record<typeof props.guide, DemoDefinition[]> = {
  theme: themeGuideDemos,
  i18n: i18nGuideDemos,
  floating: floatingGuideDemos,
};

const demo = computed(() => DEMOS_MAP[props.guide]?.find((item) => item.id === props.demoId));
</script>

<template>
  <DemoBlock v-if="demo" :demo="demo" />
</template>
