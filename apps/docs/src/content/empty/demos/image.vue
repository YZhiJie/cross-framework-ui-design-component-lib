<script setup lang="ts">
import { Empty } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <Empty :description="isZh() ? '自定义插画' : 'Custom illustration'">
      <template #image>🔍</template>
    </Empty>
    <Empty />
  </div>
</template>
