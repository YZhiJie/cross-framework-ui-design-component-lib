<script setup lang="ts">
import { Badge } from '@xui/vue';
</script>

<template>
  <div class="demo-row">
    <Badge dot>
      <span class="demo-anchor">小红点</span>
    </Badge>
    <Badge :count="0" show-zero>
      <span class="demo-anchor">showZero</span>
    </Badge>
    <Badge :count="0">
      <span class="demo-anchor">零值隐藏</span>
    </Badge>
    <Badge :count="8" />
  </div>
</template>

<style scoped>
.demo-anchor {
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 6px;
}
</style>
