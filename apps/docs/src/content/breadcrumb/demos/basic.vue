<script setup lang="ts">
import { Breadcrumb } from '@xui/vue';
import type { BreadcrumbItem } from '@xui/core';

const items: BreadcrumbItem[] = [
  { label: '首页' },
  { label: '组件库' },
  { label: '面包屑 Breadcrumb' },
];
</script>

<template>
  <div class="demo-column">
    <Breadcrumb :items="items" />
    <Breadcrumb :items="items" separator=">" />
  </div>
</template>
