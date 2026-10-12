<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref('');
</script>

<template>
  <div class="demo-column">
    <Input
      v-model:value="value"
      :placeholder="isZh() ? '输入点内容...' : 'Type something...'"
      clearable
    />
    <p class="demo-text">
      {{ isZh() ? '当前值：' : 'Current: ' }}{{ value || (isZh() ? '（空）' : '(empty)') }}
    </p>
  </div>
</template>
