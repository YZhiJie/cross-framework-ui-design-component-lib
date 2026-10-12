<script setup lang="ts">
import { Spin } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-row">
    <Spin size="sm" />
    <Spin />
    <Spin size="lg" />
    <Spin size="lg" :tip="isZh() ? '加载中...' : 'Loading...'" />
  </div>
</template>
