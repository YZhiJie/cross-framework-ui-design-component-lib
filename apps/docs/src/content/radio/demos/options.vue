<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup } from '@xui/vue';
import type { RadioOption } from '@xui/core';

const value = ref('weekly');
const options: RadioOption[] = [
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
  { label: '从不（禁用）', value: 'never', disabled: true },
];
</script>

<template>
  <div class="demo-column">
    <RadioGroup v-model:value="value" :options="options" />
    <RadioGroup :options="options" disabled />
  </div>
</template>
