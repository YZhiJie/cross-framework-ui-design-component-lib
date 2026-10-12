<script setup lang="ts">
import { Empty, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <Empty :description="isZh() ? '暂无数据，去创建第一条吧' : 'No data yet — create the first one'">
    <Button type="primary">{{ isZh() ? '立即创建' : 'Create now' }}</Button>
  </Empty>
</template>
