<script setup lang="ts">
import { ref, computed } from 'vue';
import { Table } from '@xui-design/vue';
import type { TableColumn, TableRowKey } from '@xui-design/core';
import { isZh } from '../../../i18n';

type UserRow = {
  id: number;
  name: string;
  age: number;
  city: string;
};

const bigRows = computed<UserRow[]>(() =>
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: isZh() ? `用户${i + 1}` : `User ${i + 1}`,
    age: 20 + (i % 40),
    city: isZh() ? `城市${(i % 20) + 1}` : `City ${(i % 20) + 1}`,
  })),
);

const columns = computed<TableColumn[]>(() => [
  { key: 'name', title: isZh() ? '姓名' : 'Name' },
  { key: 'age', title: isZh() ? '年龄' : 'Age', width: 100, align: 'center' },
  { key: 'city', title: isZh() ? '城市' : 'City' },
]);

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
      {{
        isZh()
          ? `虚拟滚动 · 1000 行仅渲染可视窗口；当前选中 ${selectedRowKeys.length} 行（滚动时勾选状态保持）。`
          : `Virtual scroll · only the visible window of 1000 rows is rendered; ${selectedRowKeys.length} row(s) selected (selection preserved on scroll).`
      }}
    </p>
  </div>
</template>
