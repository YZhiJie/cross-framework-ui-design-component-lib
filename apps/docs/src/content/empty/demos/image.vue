<script setup lang="ts">
import { Empty } from '@xui-design/vue';
</script>

<template>
  <div class="demo-column">
    <Empty description="自定义插画">
      <template #image>🔍</template>
    </Empty>
    <Empty />
  </div>
</template>
