<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@xui/vue';

const value = ref('');
</script>

<template>
  <div class="demo-column">
    <Input v-model:value="value" placeholder="输入点内容..." clearable />
    <p class="demo-text">当前值：{{ value || '（空）' }}</p>
  </div>
</template>
