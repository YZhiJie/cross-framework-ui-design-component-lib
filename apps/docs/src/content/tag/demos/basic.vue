<script setup lang="ts">
import { Tag } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-row">
    <Tag>{{ isZh() ? '默认' : 'Default' }}</Tag>
    <Tag type="primary">{{ isZh() ? '主要' : 'Primary' }}</Tag>
    <Tag type="success">{{ isZh() ? '成功' : 'Success' }}</Tag>
    <Tag type="warning">{{ isZh() ? '警告' : 'Warning' }}</Tag>
    <Tag type="danger">{{ isZh() ? '危险' : 'Danger' }}</Tag>
  </div>
</template>
