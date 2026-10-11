<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs, watchEffect } from 'vue';
import {
  createTableLogic,
  createVirtualListLogic,
  formatTableCellValue,
  getRowKeyOf,
} from '@xui/shared';
import { icons } from '@xui/icons';
import type { TableColumn, TableProps, TableRow, TableSortOrder } from '@xui/core';

const props = withDefaults(defineProps<Omit<TableProps, 'onSortChange' | 'onRowClick'>>(), {
  columns: undefined,
  dataSource: undefined,
  rowKey: undefined,
  stripe: false,
  border: false,
  virtual: false,
  height: undefined,
  rowHeight: 40,
  rowSelection: undefined,
  className: undefined,
  style: undefined,
});

const emit = defineEmits<{
  sortChange: [sort: { key: string; order: TableSortOrder }];
  rowClick: [record: TableRow, index: number];
}>();

// 父组件是否监听 rowClick（决定行 hover 指针样式）
const attrs = useAttrs();
const hasRowClickListener = computed(() => attrs.onRowClick !== undefined);

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { dataSource } = props;

const logic = createTableLogic({
  dataSource,
  rowKey: props.rowKey,
  rowSelection: props.rowSelection,
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
  logic.updateOptions({
    dataSource: props.dataSource,
    rowKey: props.rowKey,
    rowSelection: props.rowSelection,
  });
});

// ---- 虚拟滚动（基于 createVirtualListLogic 组合；非虚拟模式零开销） ----
const vl = createVirtualListLogic({ itemCount: 0, itemHeight: props.rowHeight ?? 40 });
const vlState = ref(vl.getState());
const vlUnsubscribe = vl.subscribe((next) => {
  vlState.value = next;
});
onUnmounted(() => {
  vlUnsubscribe();
});

const scrollRef = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (!props.virtual) return;
  const el = scrollRef.value;
  if (!el) return;
  vl.updateOptions({ viewportHeight: el.clientHeight });
  // jsdom / 旧环境无 ResizeObserver：跳过视口尺寸跟随（初始值已同步）
  if (typeof ResizeObserver === 'undefined') return;
  resizeObserver = new ResizeObserver(() => {
    vl.updateOptions({ viewportHeight: el.clientHeight });
  });
  resizeObserver.observe(el);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

const handleScroll = (event: Event) => {
  if (!props.virtual) return;
  vl.scrollTo((event.target as HTMLElement).scrollTop);
};

// Props → 虚拟窗口参数同步
watchEffect(() => {
  if (!props.virtual) return;
  vl.updateOptions({
    itemCount: state.value.sortedData.length,
    itemHeight: props.rowHeight ?? 40,
  });
});

const visibleRows = computed(() => {
  const data = state.value.sortedData;
  if (!props.virtual) return data;
  if (vlState.value.endIndex < vlState.value.startIndex) return [];
  return data.slice(vlState.value.startIndex, vlState.value.endIndex + 1);
});

// ---- 自定义透传：className / style（含组件级 CSS 变量） ----
const rootClass = computed(() => [
  props.className,
  {
    'is-striped': props.stripe,
    'is-bordered': props.border,
    'is-virtual': props.virtual,
  },
]);

const rootStyle = computed(() => {
  const style: Record<string, string> = { ...props.style };
  if (props.virtual) {
    if (props.height !== undefined) {
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    }
    style['--xui-table-row-height'] = `${props.rowHeight ?? 40}px`;
  }
  return Object.keys(style).length > 0 ? style : undefined;
});

// ---- 行选择 ----
const hasSelection = computed(() => props.rowSelection !== undefined);

const colspan = computed(() => (props.columns?.length ?? 0) + (hasSelection.value ? 1 : 0));

const isSelectedRow = (record: TableRow, index: number): boolean => {
  const key = getRowKeyOf(record, index, props.rowKey);
  return state.value.selectedRowKeys.includes(key);
};

const isCheckboxDisabled = (record: TableRow, index: number): boolean => {
  return props.rowSelection?.getCheckboxDisabled?.(record, index) ?? false;
};

const handleToggleRow = (record: TableRow, index: number, event: Event) => {
  logic.toggleRow(getRowKeyOf(record, index, props.rowKey));
  // 受控模式：state 未变时 Vue patch 不会恢复 :checked，需立即回弹 DOM
  if (props.rowSelection?.selectedRowKeys !== undefined) {
    (event.target as HTMLInputElement).checked = isSelectedRow(record, index);
  }
};

const handleToggleAll = (event: Event) => {
  logic.toggleAll();
  if (props.rowSelection?.selectedRowKeys !== undefined) {
    (event.target as HTMLInputElement).checked = state.value.allSelected;
  }
};

// ---- 行交互 ----
const handleRowClick = (record: TableRow, index: number) => {
  emit('rowClick', record, index);
};

const rowClass = (record: TableRow, index: number) => ({
  'is-even': index % 2 === 1,
  'is-selected': hasSelection.value && isSelectedRow(record, index),
  'is-clickable': hasRowClickListener.value,
});

// ---- 排序 ----
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
  <div
    ref="scrollRef"
    class="xui-table"
    :class="rootClass"
    :style="rootStyle"
    @scroll="handleScroll"
  >
    <table class="xui-table__table">
      <thead>
        <tr>
          <th v-if="hasSelection" class="xui-table__th" :style="{ width: '42px' }">
            <input
              type="checkbox"
              class="xui-table__check"
              :checked="state.allSelected"
              :indeterminate="state.indeterminate"
              aria-label="全选"
              @change="handleToggleAll($event)"
            />
          </th>
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
                <slot name="sortIcon" :order="'asc'">
                  <svg
                    viewBox="0 0 24 24"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    :class="sortIconClass(column, 'up')"
                    v-html="arrowUp"
                  />
                </slot>
                <slot name="sortIcon" :order="'desc'">
                  <svg
                    viewBox="0 0 24 24"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    :class="sortIconClass(column, 'down')"
                    v-html="arrowDown"
                  />
                </slot>
              </span>
            </button>
            <span v-else>{{ column.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="props.virtual && vlState.offsetY > 0"
          class="xui-table__spacer"
          aria-hidden="true"
        >
          <td :style="{ height: `${vlState.offsetY}px` }" :colspan="colspan" />
        </tr>
        <tr
          v-for="(record, i) in visibleRows"
          :key="getRowKeyOf(record, props.virtual ? vlState.startIndex + i : i, props.rowKey)"
          :class="rowClass(record, props.virtual ? vlState.startIndex + i : i)"
          @click="handleRowClick(record, props.virtual ? vlState.startIndex + i : i)"
        >
          <td v-if="hasSelection" class="xui-table__td" @click.stop>
            <input
              type="checkbox"
              class="xui-table__check"
              :checked="isSelectedRow(record, props.virtual ? vlState.startIndex + i : i)"
              :disabled="isCheckboxDisabled(record, props.virtual ? vlState.startIndex + i : i)"
              :aria-label="`选择第 ${i + 1} 行`"
              @change="handleToggleRow(record, props.virtual ? vlState.startIndex + i : i, $event)"
            />
          </td>
          <td
            v-for="column in props.columns"
            :key="column.key"
            class="xui-table__td"
            :style="cellStyle(column)"
          >
            {{ cellText(column, record, props.virtual ? vlState.startIndex + i : i) }}
          </td>
        </tr>
        <tr
          v-if="props.virtual && vlState.fillerHeight > 0"
          class="xui-table__spacer"
          aria-hidden="true"
        >
          <td :style="{ height: `${vlState.fillerHeight}px` }" :colspan="colspan" />
        </tr>
        <tr v-if="state.sortedData.length === 0">
          <td class="xui-table__empty" :colspan="colspan">
            <slot name="empty">暂无数据</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
