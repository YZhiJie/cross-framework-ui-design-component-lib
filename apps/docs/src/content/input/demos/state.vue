<script setup lang="ts">
import { Input } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <Input :value="isZh() ? '禁用态' : 'Disabled'" disabled />
    <Input :value="isZh() ? '只读态' : 'Read-only'" readonly />
    <Input :placeholder="isZh() ? '带前缀内容' : 'With prefix'">
      <template #prefix>🔍</template>
    </Input>
  </div>
</template>
