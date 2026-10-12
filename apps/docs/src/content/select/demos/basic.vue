<script setup lang="ts">
import { ref, computed } from 'vue';
import { Select } from '@xui-design/vue';
import type { SelectOption } from '@xui-design/core';
import { isZh } from '../../../i18n';

const value = ref('');
const options = computed<SelectOption[]>(() =>
  isZh()
    ? [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳（暂不可选）', value: 'shenzhen', disabled: true },
      ]
    : [
        { label: 'Beijing', value: 'beijing' },
        { label: 'Shanghai', value: 'shanghai' },
        { label: 'Guangzhou', value: 'guangzhou' },
        { label: 'Shenzhen (unavailable)', value: 'shenzhen', disabled: true },
      ],
);
</script>

<template>
  <div class="demo-column">
    <Select
      v-model:value="value"
      :options="options"
      :placeholder="isZh() ? '请选择城市' : 'Select a city'"
      clearable
    />
    <p class="demo-text">
      {{ isZh() ? '当前选中' : 'Selected' }}：{{ value || (isZh() ? '（未选择）' : '(none)') }}
    </p>
  </div>
</template>
