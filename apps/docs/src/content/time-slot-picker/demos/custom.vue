<script setup lang="ts">
import { ref } from 'vue';
import { Button, TimeSlotPicker } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const disabled = ref(true);
const value = ref<string[]>(['w:3:10', 'w:3:11', 'w:4:15']);

// 组件级 CSS 变量：仅作用于当前实例
const pickerStyle = {
  '--xui-time-slot-size': '28px',
  '--xui-time-slot-gap': '5px',
  '--xui-color-primary': '#0ea5e9',
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button size="sm" @click="disabled = !disabled">
        {{ disabled ? (isZh() ? '启用' : 'Enable') : isZh() ? '禁用' : 'Disable' }}
      </Button>
    </div>
    <TimeSlotPicker
      v-model:value="value"
      granularity="week"
      :disabled="disabled"
      :style="pickerStyle"
    />
  </div>
</template>
