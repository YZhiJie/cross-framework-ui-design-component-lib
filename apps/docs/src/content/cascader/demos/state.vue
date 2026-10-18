<script setup lang="ts">
import { ref } from 'vue';
import { Cascader } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref<string[]>(['east', 'hangzhou']);

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
      { label: '天津', value: 'tianjin' },
    ],
  },
];
</script>

<template>
  <div class="demo-column">
    <Cascader
      v-model:value="value"
      :options="options"
      change-on-select
      separator=" > "
      placeholder="选择任意层级"
    />
    <p class="demo-text">
      {{
        isZh()
          ? `changeOnSelect：选中任意层级即触发，分隔符为 " > "`
          : `changeOnSelect: select any level to trigger, separator " > "`
      }}
    </p>
  </div>
</template>
