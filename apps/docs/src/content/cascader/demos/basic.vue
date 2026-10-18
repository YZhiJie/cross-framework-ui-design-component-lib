<script setup lang="ts">
import { ref } from 'vue';
import { Cascader } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref<string[]>([]);

const options = [
  {
    label: '华东',
    value: 'east',
    children: [
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
  {
    label: '华北',
    value: 'north',
    children: [
      { label: '北京', value: 'beijing' },
      { label: '天津', value: 'tianjin', disabled: true },
    ],
  },
];
</script>

<template>
  <div class="demo-column">
    <Cascader v-model:value="value" :options="options" clearable />
    <p class="demo-text">
      {{ isZh() ? `选中值：${JSON.stringify(value)}` : `Value: ${JSON.stringify(value)}` }}
    </p>
  </div>
</template>
