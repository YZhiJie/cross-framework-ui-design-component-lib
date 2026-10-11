<script setup lang="ts">
import { ref } from 'vue';
import { Breadcrumb } from '@xui/vue';
import type { BreadcrumbItem } from '@xui/core';

const lastClick = ref('（点击前级项试试）');
const items: BreadcrumbItem[] = [
  { label: '首页' },
  { label: '归档（禁用）', disabled: true },
  { label: '文章详情' },
];

const onItemClick = (item: BreadcrumbItem, index: number) => {
  lastClick.value = `点击了第 ${index} 项：${item.label}`;
};
</script>

<template>
  <div class="demo-column">
    <Breadcrumb :items="items" @item-click="onItemClick" />
    <p class="demo-text">{{ lastClick }}（末项为当前页，不可点击）</p>
  </div>
</template>
