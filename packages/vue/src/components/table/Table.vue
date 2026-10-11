<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createTableLogic, formatTableCellValue } from '@xui/shared';
import { icons } from '@xui/icons';
import type { TableColumn, TableProps, TableSortOrder } from '@xui/core';

const props = withDefaults(defineProps<Omit<TableProps, 'onSortChange'>>(), {
  columns: undefined,
  dataSource: undefined,
  rowKey: undefined,
  stripe: false,
  border: false,
});

const emit = defineEmits<{
  sortChange: [sort: { key: string; order: TableSortOrder }];
}>();

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { dataSource } = props;

const logic = createTableLogic({
  dataSource,
  onSortChange: (sort) => emit('sortChange', sort),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（dataSource 变更保持当前排序重排）
watchEffect(() => {
  logic.updateOptions({ dataSource: props.dataSource });
});

const handleSort = (column: TableColumn) => {
  if (!column.sortable) return;
  logic.toggleSort(column.key);
};

const ariaSort = (column: TableColumn): 'ascending' | 'descending' | undefined => {
  if (state.value.sortKey !== column.key) return undefined;
  return state.value.sortOrder === 'asc' ? 'ascending' : 'descending';
};

const cellStyle = (column: TableColumn): Record<string, string> | undefined => {
  const style: Record<string, string> = {};
  if (column.width !== undefined) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
  }
  if (column.align !== undefined) {
    style.textAlign = column.align;
  }
  return Object.keys(style).length > 0 ? style : undefined;
};

const cellText = (column: TableColumn, record: Record<string, unknown>, index: number): string => {
  return column.render ? column.render(record, index) : formatTableCellValue(record[column.key]);
};

const rowKeyOf = (record: Record<string, unknown>, index: number): string | number => {
  if (props.rowKey === undefined) return index;
  const key = record[props.rowKey];
  return typeof key === 'string' || typeof key === 'number' ? key : index;
};

const sortIconClass = (column: TableColumn, order: 'up' | 'down') => {
  const active =
    state.value.sortKey === column.key &&
    state.value.sortOrder === (order === 'up' ? 'asc' : 'desc');
  return { 'is-active': active };
};

const arrowUp = icons['arrow-up'];
const arrowDown = icons['arrow-down'];
</script>

<template>
  <div class="xui-table" :class="{ 'is-striped': props.stripe, 'is-bordered': props.border }">
    <table class="xui-table__table">
      <thead>
        <tr>
          <th
            v-for="column in props.columns"
            :key="column.key"
            class="xui-table__th"
            :style="cellStyle(column)"
            :aria-sort="ariaSort(column)"
            :scope="'col'"
          >
            <button
              v-if="column.sortable"
              type="button"
              class="xui-table__sort"
              @click="handleSort(column)"
            >
              {{ column.title }}
              <span class="xui-table__sort-icons" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="sortIconClass(column, 'up')"
                  v-html="arrowUp"
                />
                <svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="sortIconClass(column, 'down')"
                  v-html="arrowDown"
                />
              </span>
            </button>
            <span v-else>{{ column.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in state.sortedData" :key="rowKeyOf(record, index)">
          <td
            v-for="column in props.columns"
            :key="column.key"
            class="xui-table__td"
            :style="cellStyle(column)"
          >
            {{ cellText(column, record, index) }}
          </td>
        </tr>
        <tr v-if="state.sortedData.length === 0">
          <td class="xui-table__empty" :colspan="props.columns.length || 1">
            <slot name="empty">暂无数据</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
