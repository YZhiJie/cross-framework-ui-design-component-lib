<script setup lang="ts">
import { Alert } from '@xui-design/vue';
</script>

<template>
  <div class="demo-column">
    <Alert type="warning" show-icon closable>
      描述内容通过默认插槽传入，支持更灵活的排版。
      <template #title>
        <strong>可关闭且带图标</strong>
      </template>
    </Alert>
  </div>
</template>
