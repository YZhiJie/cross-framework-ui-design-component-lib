<script setup lang="ts">
import { Badge } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-row">
    <Badge dot>
      <span class="demo-anchor">{{ isZh() ? '小红点' : 'Dot' }}</span>
    </Badge>
    <Badge :count="0" show-zero>
      <span class="demo-anchor">showZero</span>
    </Badge>
    <Badge :count="0">
      <span class="demo-anchor">{{ isZh() ? '零值隐藏' : 'Hidden when zero' }}</span>
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
