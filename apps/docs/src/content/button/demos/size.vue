<script setup lang="ts">
import { Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
    <Button block>{{ isZh() ? 'Block（宽度撑满容器）' : 'Block (full width)' }}</Button>
  </div>
</template>
