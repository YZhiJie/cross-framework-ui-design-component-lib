<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { TimeSlotPicker, Button } from '@xui-design/vue';
import type { TimeSlotPickerRef } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const pickerRef = useTemplateRef<TimeSlotPickerRef>('picker');
const value = ref<string[]>(['2026-10-01', '2026-10-02']);
</script>

<template>
  <div class="demo-column">
    <TimeSlotPicker
      ref="picker"
      v-model:value="value"
      granularity="month"
      reference-date="2026-10-20"
    />
    <div class="demo-row">
      <Button size="sm" @click="pickerRef?.selectAll()">
        {{ isZh() ? '全选本月' : 'Select month' }}
      </Button>
      <Button size="sm" @click="pickerRef?.clear()">
        {{ isZh() ? '清空' : 'Clear' }}
      </Button>
      <span class="demo-text">
        {{ isZh() ? `已选择 ${value.length} 天` : `${value.length} days selected` }}
      </span>
    </div>
  </div>
</template>
