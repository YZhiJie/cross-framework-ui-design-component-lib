<script setup lang="ts">
import { computed, ref } from 'vue';
import { Breadcrumb } from '@xui-design/vue';
import type { BreadcrumbItem } from '@xui-design/core';
import { isZh } from '../../../i18n';

const lastClick = ref(isZh() ? '（点击前级项试试）' : '(Try clicking a non-last item)');
const items = computed<BreadcrumbItem[]>(() =>
  isZh()
    ? [{ label: '首页' }, { label: '归档（禁用）', disabled: true }, { label: '文章详情' }]
    : [
        { label: 'Home' },
        { label: 'Archive (disabled)', disabled: true },
        { label: 'Article Detail' },
      ],
);

const onItemClick = (item: BreadcrumbItem, index: number) => {
  lastClick.value = isZh()
    ? `点击了第 ${index} 项：${item.label}`
    : `Clicked item ${index}: ${item.label}`;
};
</script>

<template>
  <div class="demo-column">
    <Breadcrumb :items="items" @item-click="onItemClick" />
    <p class="demo-text">
      {{ lastClick
      }}{{
        isZh() ? '（末项为当前页，不可点击）' : ' (last item is the current page, not clickable)'
      }}
    </p>
  </div>
</template>
