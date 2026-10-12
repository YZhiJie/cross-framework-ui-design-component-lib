<script setup lang="ts">
import { ref } from 'vue';
import { InputNumber } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref(3.5);
</script>

<template>
  <div class="demo-column">
    <InputNumber v-model:value="value" :min="0" :max="10" :step="0.5" :precision="2" />
    <p class="demo-text">
      {{
        isZh()
          ? `当前值：${value}（范围 0 - 10，步长 0.5，保留 2 位小数）`
          : `Current: ${value} (range 0-10, step 0.5, 2 decimals)`
      }}
    </p>
  </div>
</template>
