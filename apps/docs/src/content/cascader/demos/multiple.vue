<script setup lang="ts">
import { ref } from 'vue';
import { Cascader } from '@xui-design/vue';

const options = [
  {
    label: '华东',
    value: 'east',
    children: [
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
      { label: '南京', value: 'nanjing' },
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

const value = ref<string[][]>([]);
</script>

<template>
  <div class="demo-column">
    <Cascader
      v-model:value="value"
      :options="options"
      multiple
      clearable
      placeholder="请选择（可多选）"
    />
    <p class="demo-text">已选路径：{{ JSON.stringify(value) }}</p>
  </div>
</template>
