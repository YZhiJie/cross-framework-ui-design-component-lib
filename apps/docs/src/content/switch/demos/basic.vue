<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@xui-design/vue';

const enabled = ref(false);
</script>

<template>
  <div class="demo-row">
    <Switch v-model:value="enabled" />
    <span class="demo-text">当前值：{{ enabled ? '开启' : '关闭' }}</span>
  </div>
</template>
