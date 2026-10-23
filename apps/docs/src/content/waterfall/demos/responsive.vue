<script setup lang="ts">
import { Waterfall } from '@xui-design/vue';

const items = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: `卡片 ${i + 1}`,
  height: 80 + Math.floor(Math.random() * 200),
}));

const breakpoints = [
  { minWidth: 0, columns: 1 },
  { minWidth: 600, columns: 2 },
  { minWidth: 1000, columns: 3 },
];
</script>

<template>
  <div class="responsive-demo">
    <p class="tip">提示：拖动浏览器窗口观察列数随容器宽度自动切换</p>
    <Waterfall
      :items="items"
      row-key="id"
      :breakpoints="breakpoints"
      :gutter="12"
    >
      <template #item="{ item }">
        <div
          v-if="item"
          class="demo-card alt"
          :style="{ height: `${(item as any).height}px` }"
        >
          {{ (item as any).title }}
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<style scoped>
.responsive-demo {
  border: 1px dashed #ccc;
  padding: 12px;
  border-radius: 8px;
}
.tip {
  color: #888;
  font-size: 12px;
  margin: 0 0 12px 0;
}
.demo-card.alt {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
