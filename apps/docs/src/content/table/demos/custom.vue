<script setup lang="ts">
import { computed } from 'vue';
import { Table } from '@xui-design/vue';
import type { TableColumn } from '@xui-design/core';
import { isZh } from '../../../i18n';

const columns = computed<TableColumn[]>(() => [
  { key: 'name', title: isZh() ? '姓名' : 'Name' },
  {
    key: 'action',
    title: isZh() ? '操作' : 'Action',
    render: (record: Record<string, unknown>) =>
      isZh() ? `查看 ${String(record.name)}` : `View ${String(record.name)}`,
  },
]);

const dataSource = computed(() =>
  isZh()
    ? [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ]
    : [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ],
);
</script>

<template>
  <div class="demo-column">
    <Table :columns="columns" :data-source="dataSource" row-key="id" border />
    <Table :columns="columns" :data-source="[]">
      <template #empty>
        <span>{{ isZh() ? '自定义空态：没有更多数据啦' : 'Custom empty: no more data' }}</span>
      </template>
    </Table>
  </div>
</template>
