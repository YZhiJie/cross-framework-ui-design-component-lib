<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@xui/vue';

const value = ref(true);
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Switch v-model:value="value" checked-text="开启" unchecked-text="关闭" />
      <Switch default-value checked-text="ON" unchecked-text="OFF" />
      <Switch size="sm" default-value checked-text="是" unchecked-text="否" />
    </div>
    <div class="demo-row">
      <Switch default-value checked-text="启用超长文本展示" unchecked-text="禁用超长文本展示" />
    </div>
  </div>
</template>
