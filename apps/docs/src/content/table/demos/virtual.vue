<script setup lang="ts">
import { ref } from 'vue';
import { Table } from '@xui-design/vue';
import type { TableColumn, TableRowKey } from '@xui-design/core';

type UserRow = {
  id: number;
  name: string;
  age: number;
  city: string;
};

const bigRows: UserRow[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + (i % 40),
  city: `城市${(i % 20) + 1}`,
}));

const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', width: 100, align: 'center' },
  { key: 'city', title: '城市' },
];

const selectedRowKeys = ref<TableRowKey[]>([]);

const handleSelectionChange = (keys: TableRowKey[]) => {
  selectedRowKeys.value = keys;
};
</script>

<template>
  <div class="demo-column">
    <Table
      :columns="columns"
      :data-source="bigRows"
      row-key="id"
      virtual
      :height="320"
      :row-height="40"
      stripe
      :row-selection="{ onChange: handleSelectionChange }"
    />
    <p class="demo-text">
      虚拟滚动 · 1000 行仅渲染可视窗口；当前选中
      {{ selectedRowKeys.length }} 行（滚动时勾选状态保持）。
    </p>
  </div>
</template>
