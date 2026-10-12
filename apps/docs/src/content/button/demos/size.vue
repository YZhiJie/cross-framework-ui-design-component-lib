<script setup lang="ts">
import { Button } from '@xui-design/vue';
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
    <Button block>Block（宽度撑满容器）</Button>
  </div>
</template>
