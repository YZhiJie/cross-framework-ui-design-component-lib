<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const enabled = ref(false);
</script>

<template>
  <div class="demo-row">
    <Switch v-model:value="enabled" />
    <span class="demo-text"
      >{{ isZh() ? '当前值：' : 'Current: '
      }}{{ enabled ? (isZh() ? '开启' : 'On') : isZh() ? '关闭' : 'Off' }}</span
    >
  </div>
</template>
