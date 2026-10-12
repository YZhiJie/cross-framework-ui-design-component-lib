<script setup lang="ts">
import { Table } from '@xui-design/vue';
import type { TableColumn, TableSort } from '@xui-design/core';
import { computed } from 'vue';
import { isZh } from '../../../i18n';

const columns = computed<TableColumn[]>(() => [
  { key: 'name', title: isZh() ? '姓名' : 'Name' },
  { key: 'age', title: isZh() ? '年龄' : 'Age', sortable: true, width: 100, align: 'center' },
  { key: 'city', title: isZh() ? '城市' : 'City' },
]);

const dataSource = computed(() =>
  isZh()
    ? [
        { id: 1, name: '张三', age: 30, city: 'Beijing' },
        { id: 2, name: '李四', age: 25, city: 'Shanghai' },
        { id: 3, name: '王五', age: 28, city: 'Guangzhou' },
        { id: 4, name: '赵六', age: 32, city: 'Shenzhen' },
      ]
    : [
        { id: 1, name: 'John', age: 30, city: 'Beijing' },
        { id: 2, name: 'Jane', age: 25, city: 'Shanghai' },
        { id: 3, name: 'Mike', age: 28, city: 'Guangzhou' },
        { id: 4, name: 'Lily', age: 32, city: 'Shenzhen' },
      ],
);

const onSortChange = (sort: TableSort) => {
  console.log('sort-change:', sort.key, sort.order);
};
</script>

<template>
  <Table
    :columns="columns"
    :data-source="dataSource"
    row-key="id"
    stripe
    border
    @sort-change="onSortChange"
  />
</template>
