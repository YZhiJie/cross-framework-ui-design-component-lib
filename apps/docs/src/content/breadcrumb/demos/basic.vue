<script setup lang="ts">
import { computed } from 'vue';
import { Breadcrumb } from '@xui-design/vue';
import type { BreadcrumbItem } from '@xui-design/core';
import { isZh } from '../../../i18n';

const items = computed<BreadcrumbItem[]>(() =>
  isZh()
    ? [{ label: '首页' }, { label: '组件库' }, { label: '面包屑 Breadcrumb' }]
    : [{ label: 'Home' }, { label: 'Components' }, { label: 'Breadcrumb' }],
);
</script>

<template>
  <div class="demo-column">
    <Breadcrumb :items="items" />
    <Breadcrumb :items="items" separator=">" />
  </div>
</template>
