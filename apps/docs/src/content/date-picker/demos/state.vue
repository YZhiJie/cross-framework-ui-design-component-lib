<script setup lang="ts">
import { DatePicker } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <DatePicker default-value="2026-01-15" :placeholder="isZh() ? '选择日期' : 'Select a date'" />
    <DatePicker default-value="2026-01-15" disabled />
  </div>
</template>
