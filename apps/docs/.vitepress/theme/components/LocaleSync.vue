<script setup lang="ts">
/**
 * 文档语言同步：把 VitePress 路由语言（useData().lang）写入自研 i18n 模块
 *
 * - setup 阶段同步执行（SSR 与客户端水化一致），后续 demo / 指南组件的 t() / isZh()
 *   与 React demo 的 useSyncExternalStore 订阅全部跟随路由语言
 * - 本组件不渲染任何内容
 */
import { watch } from 'vue';
import { useData } from 'vitepress';
import { initDocsLocale, setDocsLocale, type DocsLocale } from '../../../src/i18n';

const { lang } = useData();

const normalize = (value: string): DocsLocale => (value === 'en-US' ? 'en-US' : 'zh-CN');

initDocsLocale(normalize(lang.value));
watch(lang, (value) => setDocsLocale(normalize(value)));
</script>

<template>
  <span hidden aria-hidden="true"></span>
</template>
