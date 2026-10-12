<script setup lang="ts">
import { ref } from 'vue';
import { Tabs } from '@xui-design/vue';
import type { TabItem } from '@xui-design/core';

const active = ref('overview');
const items: TabItem[] = [
  { label: '概览', value: 'overview' },
  { label: '配置', value: 'config' },
  { label: '日志', value: 'logs', disabled: true },
];
</script>

<template>
  <Tabs v-model:value="active" :items="items">
    <template #default="{ item }">
      <p class="demo-text">{{ item.label }}页的内容（value: {{ item.value }}）</p>
    </template>
  </Tabs>
</template>
