<script setup lang="ts">
import { ref } from 'vue';
import { TimeSlotPicker, Button } from '@xui-design/vue';
import type { TimeSlotGranularity } from '@xui-design/core';
import { isZh } from '../../../i18n';

const granularity = ref<TimeSlotGranularity>('week');
const value = ref<string[]>(['w:1:09', 'w:1:10', 'w:2:14', 'w:3:19']);

const options: { key: TimeSlotGranularity; zh: string; en: string }[] = [
  { key: 'day', zh: '按日', en: 'Day' },
  { key: 'week', zh: '按周', en: 'Week' },
  { key: 'month', zh: '按月', en: 'Month' },
  { key: 'year', zh: '按年', en: 'Year' },
];

const switchGranularity = (key: TimeSlotGranularity) => {
  if (granularity.value === key) return;
  granularity.value = key;
  value.value = [];
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button
        v-for="option in options"
        :key="option.key"
        size="sm"
        :type="granularity === option.key ? 'primary' : 'default'"
        @click="switchGranularity(option.key)"
      >
        {{ isZh() ? option.zh : option.en }}
      </Button>
    </div>
    <TimeSlotPicker v-model:value="value" :granularity="granularity" reference-date="2026-10-20" />
    <span class="demo-text">
      {{ isZh() ? `已选择 ${value.length} 个时段` : `${value.length} slots selected` }}
    </span>
  </div>
</template>
