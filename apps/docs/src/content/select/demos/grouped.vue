<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref('');

const options = [
  {
    label: isZh() ? '一线城市' : 'Tier-1 Cities',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
    ],
  },
  {
    label: isZh() ? '新一线城市' : 'New Tier-1 Cities',
    options: [
      { label: '杭州', value: 'hangzhou' },
      { label: '成都', value: 'chengdu' },
      { label: '武汉', value: 'wuhan', disabled: true },
    ],
  },
];
</script>

<template>
  <div class="demo-column">
    <Select v-model:value="value" :options="options" clearable />
    <p class="demo-text">
      {{ isZh() ? `选中值：${value || '（未选择）'}` : `Value: ${value || '(none)'}` }}
    </p>
  </div>
</template>
