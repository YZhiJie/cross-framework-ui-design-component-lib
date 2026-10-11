<script setup lang="ts">
import { ref } from 'vue';
import { InputNumber } from '@xui/vue';

const value = ref(3.5);
</script>

<template>
  <div class="demo-column">
    <InputNumber v-model:value="value" :min="0" :max="10" :step="0.5" :precision="2" />
    <p class="demo-text">当前值：{{ value }}（范围 0 - 10，步长 0.5，保留 2 位小数）</p>
  </div>
</template>
