<script setup lang="ts">
import { ref } from 'vue';
import { Pagination } from '@xui/vue';

const page = ref(3);
</script>

<template>
  <div class="demo-column">
    <Pagination v-model:value="page" :total="285" />
    <p class="demo-text">第 {{ page }} 页 / 共 29 页（每页 10 条，共 285 条）</p>
  </div>
</template>
