<script setup lang="ts">
import { Table } from '@xui-design/vue';
import type { TableColumn } from '@xui-design/core';

const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  {
    key: 'action',
    title: '操作',
    render: (record) => `查看 ${String(record.name)}`,
  },
];

const dataSource = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
];
</script>

<template>
  <div class="demo-column">
    <Table :columns="columns" :data-source="dataSource" row-key="id" border />
    <Table :columns="columns" :data-source="[]">
      <template #empty>
        <span>自定义空态：没有更多数据啦</span>
      </template>
    </Table>
  </div>
</template>
