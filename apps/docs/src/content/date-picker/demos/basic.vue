<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@xui-design/vue';

const value = ref('2026-10-01');
</script>

<template>
  <div class="demo-column">
    <DatePicker v-model:value="value" clearable />
    <p class="demo-text">当前日期：{{ value || '（未选择）' }}</p>
  </div>
</template>
