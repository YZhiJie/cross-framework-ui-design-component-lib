<script setup lang="ts">
import { Select } from '@xui/vue';

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
];
</script>

<template>
  <div class="demo-column">
    <Select :options="options" default-value="1" />
    <Select :options="options" default-value="1" disabled />
  </div>
</template>
