<script setup lang="ts">
import { computed } from 'vue';
import { Tabs } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const items = computed(() => [
  { label: isZh() ? '章节一' : 'Chapter 1', value: 'ch1' },
  { label: isZh() ? '章节二' : 'Chapter 2', value: 'ch2' },
  { label: isZh() ? '章节三' : 'Chapter 3', value: 'ch3' },
]);
</script>

<template>
  <Tabs default-value="ch2" :items="items">
    <template #default="{ item }">
      <p class="demo-text">
        {{ isZh() ? `当前激活：${item.label}` : `Active: ${item.label}` }}
      </p>
    </template>
  </Tabs>
</template>
