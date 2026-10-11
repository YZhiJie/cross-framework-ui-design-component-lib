<script setup lang="ts">
import { Tabs } from '@xui/vue';

const items = [
  { label: '章节一', value: 'ch1' },
  { label: '章节二', value: 'ch2' },
  { label: '章节三', value: 'ch3' },
];
</script>

<template>
  <Tabs default-value="ch2" :items="items">
    <template #default="{ item }">
      <p class="demo-text">当前激活：{{ item.label }}</p>
    </template>
  </Tabs>
</template>
