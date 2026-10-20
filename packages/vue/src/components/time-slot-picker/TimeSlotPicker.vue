<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { createTimeSlotPickerLogic } from '@xui-design/shared';
import type {
  TimeSlotGrid,
  TimeSlotGridCell,
  TimeSlotGridColumn,
  TimeSlotGridRow,
} from '@xui-design/shared';
import type { TimeSlotPickerProps } from '@xui-design/core';
import { useLocaleData } from '../../hooks/use-locale';

const props = withDefaults(defineProps<Omit<TimeSlotPickerProps, 'onChange'>>(), {
  granularity: 'week',
  value: undefined,
  defaultValue: () => [],
  referenceDate: '',
  showFooter: true,
  disabled: false,
});

const emit = defineEmits<{
  change: [value: string[]];
  'update:value': [value: string[]];
}>();

const locale = useLocaleData();

const logic = createTimeSlotPickerLogic({
  granularity: props.granularity,
  value: props.value,
  defaultValue: props.defaultValue,
  referenceDate: props.referenceDate,
  onChange: (value) => {
    emit('update:value', value);
    emit('change', value);
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

// Props 变更同步到逻辑层
watchEffect(() => {
  logic.updateOptions({
    granularity: props.granularity,
    value: props.value,
    referenceDate: props.referenceDate,
  });
});

// 显式引用 state 让 computed 收集依赖（粒度变化时逻辑层重建网格）
const grid = computed<TimeSlotGrid>(() => {
  void state.value;
  return logic.getGrid();
});

const selectedSet = computed(() => new Set(state.value.value));
const paintKeys = computed(() => new Set(state.value.paint?.keys ?? []));

/** 格子类名：选中态 + 框选预览态（预览只改变视觉，不等同于已提交的选中） */
const cellClass = (key: string) => {
  const selected = selectedSet.value.has(key);
  const session = state.value.paint;
  const previewing = session !== null && paintKeys.value.has(key);
  return {
    'is-selected': selected,
    'is-preview-selected': previewing && session !== null && session.selected && !selected,
    'is-preview-unselected': previewing && session !== null && !session.selected && selected,
  };
};

const gridStyle = computed(() => ({
  '--xui-time-slot-columns': String(grid.value.columns.length),
}));

const showColumnHeader = computed(() => props.granularity !== 'day');
const showCellText = computed(() => props.granularity === 'day' || props.granularity === 'month');

const summaryText = computed(() => {
  const data = locale.value.timeSlotPicker;
  return state.value.selectedCount === 0
    ? data.hint
    : data.summary(state.value.selectedCount, state.value.total);
});

const pad2 = (value: number): string => String(value).padStart(2, '0');

const columnLabel = (column: TimeSlotGridColumn): string => {
  const data = locale.value.timeSlotPicker;
  if (column.kind === 'hour') {
    return props.granularity === 'week' && column.index % 3 === 0 ? pad2(column.index) : '';
  }
  if (column.kind === 'weekday') return data.weekdays[column.index - 1] ?? '';
  if (column.kind === 'month') return data.months[column.index - 1] ?? '';
  return '';
};

const rowLabel = (row: TimeSlotGridRow): string => {
  if (row.weekday === undefined) return '';
  return locale.value.timeSlotPicker.weekdays[row.weekday - 1] ?? '';
};

const cellLabel = (cell: TimeSlotGridCell): string => {
  const data = locale.value.timeSlotPicker;
  if (cell.hour !== undefined) {
    const hour = data.hour(cell.hour);
    if (cell.weekday !== undefined) {
      return `${data.weekdays[cell.weekday - 1] ?? ''} ${hour}`;
    }
    return hour;
  }
  if (cell.date) {
    const [year, month, day] = cell.date.split('-').map(Number);
    return data.dateLabel(year, month, day);
  }
  return '';
};

const cellText = (cell: TimeSlotGridCell): string => {
  if (props.granularity === 'month') return String(cell.day ?? '');
  if (props.granularity === 'day') return pad2(cell.hour ?? 0);
  return '';
};

// 矩形框选：mousedown 记录锚点，mouseenter 时按锚点与当前格子构成矩形预览，mouseup 提交
const paintMode = ref<boolean | null>(null);

const handleMouseDown = (key: string) => {
  if (props.disabled) return;
  paintMode.value = logic.beginPaint(key);
};

const handleMouseEnter = (key: string) => {
  if (props.disabled || paintMode.value === null) return;
  logic.paintTo(key);
};

const stopPaint = () => {
  if (paintMode.value === null) return;
  paintMode.value = null;
  logic.endPaint();
};

const handleCellClick = (event: MouseEvent, key: string) => {
  if (props.disabled) return;
  // 鼠标点击已由 mousedown 处理；键盘触发的 click（detail 为 0 / undefined）在此切换
  if (!event.detail) logic.toggle(key);
};

onMounted(() => {
  window.addEventListener('mouseup', stopPaint);
});

onBeforeUnmount(() => {
  unsubscribe();
  window.removeEventListener('mouseup', stopPaint);
});

defineExpose({
  clear: () => logic.clear(),
  selectAll: () => logic.selectAll(),
  toggle: (key: string) => logic.toggle(key),
});
</script>

<template>
  <div
    class="xui-time-slot-picker"
    :class="[`xui-time-slot-picker--${granularity}`, { 'is-disabled': disabled }, className]"
    :style="style"
    role="group"
    :aria-label="locale.timeSlotPicker.region"
    :aria-disabled="disabled || undefined"
  >
    <div class="xui-time-slot-picker__scroll">
      <div class="xui-time-slot-picker__grid" :style="gridStyle">
        <template v-if="showColumnHeader">
          <span class="xui-time-slot-picker__corner" aria-hidden="true" />
          <span
            v-for="column in grid.columns"
            :key="column.key"
            class="xui-time-slot-picker__col-label"
            :class="{ 'is-month': column.kind === 'month' }"
            aria-hidden="true"
          >
            {{ columnLabel(column) }}
          </span>
        </template>

        <template v-for="row in grid.rows" :key="row.key">
          <span class="xui-time-slot-picker__row-label" aria-hidden="true">
            {{ rowLabel(row) }}
          </span>
          <template
            v-for="(cell, index) in row.cells"
            :key="cell ? cell.key : `${row.key}-blank-${index}`"
          >
            <span v-if="!cell" class="xui-time-slot-picker__cell is-empty" aria-hidden="true" />
            <button
              v-if="cell"
              type="button"
              class="xui-time-slot-picker__cell"
              :class="cellClass(cell.key)"
              :disabled="disabled"
              :aria-pressed="selectedSet.has(cell.key)"
              :aria-label="cellLabel(cell)"
              :title="cellLabel(cell)"
              @mousedown.prevent="handleMouseDown(cell.key)"
              @mouseenter="handleMouseEnter(cell.key)"
              @click="handleCellClick($event, cell.key)"
            >
              <span v-if="showCellText" class="xui-time-slot-picker__cell-text">
                {{ cellText(cell) }}
              </span>
            </button>
          </template>
        </template>
      </div>
    </div>

    <div v-if="showFooter" class="xui-time-slot-picker__footer">
      <span class="xui-time-slot-picker__summary">{{ summaryText }}</span>
      <span class="xui-time-slot-picker__legend">
        <span class="xui-time-slot-picker__legend-item">
          <span class="xui-time-slot-picker__legend-swatch" aria-hidden="true" />
          {{ locale.timeSlotPicker.unselected }}
        </span>
        <span class="xui-time-slot-picker__legend-item">
          <span class="xui-time-slot-picker__legend-swatch is-selected" aria-hidden="true" />
          {{ locale.timeSlotPicker.selected }}
        </span>
      </span>
    </div>
  </div>
</template>
