<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref<string | [string, string]>('2026-10-01');
</script>

<template>
  <div class="demo-column">
    <DatePicker v-model:value="value" clearable />
    <p class="demo-text">
      {{ isZh() ? '当前日期' : 'Current date' }}：{{ value || (isZh() ? '（未选择）' : '(none)') }}
    </p>
  </div>
</template>
