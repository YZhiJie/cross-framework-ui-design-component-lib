<script setup lang="ts">
import { Spin } from '@xui-design/vue';
</script>

<template>
  <div class="demo-row">
    <Spin size="sm" />
    <Spin />
    <Spin size="lg" />
    <Spin size="lg" tip="加载中..." />
  </div>
</template>
