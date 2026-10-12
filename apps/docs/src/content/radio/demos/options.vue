<script setup lang="ts">
import { ref, computed } from 'vue';
import { RadioGroup } from '@xui-design/vue';
import type { RadioOption } from '@xui-design/core';
import { isZh } from '../../../i18n';

const value = ref('weekly');
const options = computed<RadioOption[]>(() =>
  isZh()
    ? [
        { label: '每天', value: 'daily' },
        { label: '每周', value: 'weekly' },
        { label: '每月', value: 'monthly' },
        { label: '从不（禁用）', value: 'never', disabled: true },
      ]
    : [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Never (disabled)', value: 'never', disabled: true },
      ],
);
</script>

<template>
  <div class="demo-column">
    <RadioGroup v-model:value="value" :options="options" />
    <RadioGroup :options="options" disabled />
  </div>
</template>
