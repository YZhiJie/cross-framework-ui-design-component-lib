<script setup lang="ts">
import { DatePicker } from '@xui-design/vue';
</script>

<template>
  <div class="demo-column">
    <DatePicker default-value="2026-01-15" placeholder="选择日期" />
    <DatePicker default-value="2026-01-15" disabled />
  </div>
</template>
