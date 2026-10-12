<script setup lang="ts">
import { ref, computed } from 'vue';
import { Tabs } from '@xui-design/vue';
import type { TabItem } from '@xui-design/core';
import { isZh } from '../../../i18n';

const active = ref('overview');
const items = computed<TabItem[]>(() => [
  { label: isZh() ? '概览' : 'Overview', value: 'overview' },
  { label: isZh() ? '配置' : 'Config', value: 'config' },
  { label: isZh() ? '日志' : 'Logs', value: 'logs', disabled: true },
]);
</script>

<template>
  <Tabs v-model:value="active" :items="items">
    <template #default="{ item }">
      <p class="demo-text">
        {{
          isZh()
            ? `${item.label}页的内容（value: ${item.value}）`
            : `${item.label} panel content (value: ${item.value})`
        }}
      </p>
    </template>
  </Tabs>
</template>
