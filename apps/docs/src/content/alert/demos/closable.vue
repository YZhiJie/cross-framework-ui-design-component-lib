<script setup lang="ts">
import { Alert } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <Alert type="warning" show-icon closable>
      {{
        isZh()
          ? '描述内容通过默认插槽传入，支持更灵活的排版。'
          : 'Description content is passed via the default slot, allowing flexible layout.'
      }}
      <template #title>
        <strong>{{ isZh() ? '可关闭且带图标' : 'Closable with icon' }}</strong>
      </template>
    </Alert>
  </div>
</template>
