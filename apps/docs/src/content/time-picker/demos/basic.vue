<script setup lang="ts">
import { ref } from 'vue';
import { TimePicker } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref('');
</script>

<template>
  <div class="demo-column">
    <TimePicker v-model:value="value" clearable />
    <p class="demo-text">
      {{ isZh() ? `选中时间：${value || '（未选择）'}` : `Selected: ${value || '(none)'}` }}
    </p>
  </div>
</template>
