<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@xui/vue';
import type { SelectOption } from '@xui/core';

const value = ref('');
const options: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳（暂不可选）', value: 'shenzhen', disabled: true },
];
</script>

<template>
  <div class="demo-column">
    <Select v-model:value="value" :options="options" placeholder="请选择城市" clearable />
    <p class="demo-text">当前选中：{{ value || '（未选择）' }}</p>
  </div>
</template>
