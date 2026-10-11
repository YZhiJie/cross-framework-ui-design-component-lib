<script setup lang="ts">
import { Input } from '@xui/vue';
</script>

<template>
  <div class="demo-column">
    <Input value="禁用态" disabled />
    <Input value="只读态" readonly />
    <Input placeholder="带前缀内容">
      <template #prefix>🔍</template>
    </Input>
  </div>
</template>
