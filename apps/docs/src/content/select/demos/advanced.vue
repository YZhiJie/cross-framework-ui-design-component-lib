<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@xui/vue';
import type { SelectOption } from '@xui/core';

const basicOptions: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
];

const bigOptions: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: `opt-${i + 1}`,
}));

const cities = ref<string[]>(['beijing']);
const searched = ref('');
const virtualValue = ref('');
</script>

<template>
  <div class="demo-column">
    <Select v-model:value="cities" :options="basicOptions" multiple placeholder="多选城市" />
    <p class="demo-text">多选已选：{{ cities.join('、') || '（无）' }}</p>

    <Select
      v-model:value="searched"
      :options="basicOptions"
      searchable
      clearable
      placeholder="输入关键字过滤"
    />
    <p class="demo-text">可搜索当前选中：{{ searched || '（未选择）' }}</p>

    <Select
      v-model:value="virtualValue"
      :options="bigOptions"
      virtual
      :max-height="200"
      placeholder="虚拟滚动 · 1000 项"
    />
    <p class="demo-text">虚拟滚动当前选中：{{ virtualValue || '（未选择）' }}</p>
  </div>
</template>
