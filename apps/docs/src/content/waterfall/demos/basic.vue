<script setup lang="ts">
import { Waterfall } from '@xui-design/vue';

const items = [
  { id: 1, title: '卡片 A', height: 120 },
  { id: 2, title: '卡片 B', height: 240 },
  { id: 3, title: '卡片 C', height: 160 },
  { id: 4, title: '卡片 D', height: 80 },
  { id: 5, title: '卡片 E', height: 200 },
  { id: 6, title: '卡片 F', height: 140 },
  { id: 7, title: '卡片 G', height: 280 },
  { id: 8, title: '卡片 H', height: 100 },
];

function onItemClick(item: Record<string, unknown>, index: number) {
  console.log('clicked', item, index);
}
</script>

<template>
  <Waterfall :items="items" row-key="id" :columns="3" :gutter="12" @item-click="onItemClick">
    <template #item="{ item }">
      <div v-if="item" class="demo-card" :style="{ height: `${(item as any).height}px` }">
        {{ (item as any).title }}
      </div>
    </template>
    <template #empty>
      <div style="padding: 24px; text-align: center; color: #999">暂无数据</div>
    </template>
  </Waterfall>
</template>

<style scoped>
.demo-card {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.demo-card:hover {
  transform: translateY(-2px);
}
</style>
