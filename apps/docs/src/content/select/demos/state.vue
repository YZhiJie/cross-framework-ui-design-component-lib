<script setup lang="ts">
import { computed } from 'vue';
import { Select } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const options = computed(() =>
  isZh()
    ? [
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
      ]
    : [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ],
);
</script>

<template>
  <div class="demo-column">
    <Select :options="options" default-value="1" />
    <Select :options="options" default-value="1" disabled />
  </div>
</template>
