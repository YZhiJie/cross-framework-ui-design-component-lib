<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, useTemplateRef, watchEffect } from 'vue';
import { createDatePickerLogic, getMonthMatrix } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLocaleData } from '../../hooks/use-locale';
import type { DatePickerProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<DatePickerProps, 'onChange' | 'onClear'>>(), {
  // 显式 undefined 默认值：未绑定 value 时保持 undefined → 逻辑层进入非受控模式
  // （提供 value 即受控），与 React 端语义对齐
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  disabled: false,
  clearable: false,
});

const emit = defineEmits<{
  change: [value: string];
  clear: [];
  'update:value': [value: string];
}>();

const rootRef = useTemplateRef<HTMLElement>('root');
const triggerRef = useTemplateRef<HTMLElement>('trigger');
const triggerId = useId();
const panelId = useId();

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { value, defaultValue, disabled } = props;

const logic = createDatePickerLogic({
  value,
  defaultValue,
  disabled,
  onChange: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
  onClear: () => emit('clear'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

// 点击组件外部时收起面板
const handleOutside = (event: MouseEvent) => {
  if (state.value.open && rootRef.value && !rootRef.value.contains(event.target as Node)) {
    logic.close();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleOutside);
});

onUnmounted(() => {
  unsubscribe();
  document.removeEventListener('mousedown', handleOutside);
});

// Props 变更同步到逻辑层（受控模式：value 变更 → 逻辑层）
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    disabled: props.disabled,
  });
});

const monthCells = computed(() => getMonthMatrix(state.value.viewYear, state.value.viewMonth));

// 面板文案 / 星期表头取全局语言包（setLocale / registerLocale 后响应式更新）
const locale = useLocaleData();

const title = computed(() =>
  locale.value.datePicker.titleFormat(state.value.viewYear, state.value.viewMonth),
);

const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      logic.toggleOpen();
      break;
    case 'Escape':
      if (state.value.open) {
        event.preventDefault();
        logic.close();
      }
      break;
  }
};

// 暴露命令式 focus / toggleOpen / close（与 React 适配层的 DatePickerRef 对齐）
const focus = () => {
  triggerRef.value?.focus();
};

const toggleOpen = () => {
  logic.toggleOpen();
};

const close = () => {
  logic.close();
};

defineExpose({ focus, toggleOpen, close });
</script>

<template>
  <div
    ref="root"
    class="xui-date-picker"
    :class="[className, { 'is-disabled': state.disabled, 'is-open': state.open }]"
    :style="style"
  >
    <div
      ref="trigger"
      :id="triggerId"
      class="xui-date-picker__trigger"
      role="combobox"
      :aria-expanded="state.open"
      aria-haspopup="dialog"
      :aria-controls="state.open ? panelId : undefined"
      :aria-disabled="state.disabled || undefined"
      :tabindex="state.disabled ? -1 : 0"
      @click="logic.toggleOpen()"
      @keydown="handleTriggerKeydown"
    >
      <span v-if="state.value" class="xui-date-picker__value">{{ state.value }}</span>
      <span v-else class="xui-date-picker__placeholder">{{
        props.placeholder ?? locale.datePicker.placeholder
      }}</span>
      <span
        v-if="props.clearable && state.value && !state.disabled"
        class="xui-date-picker__clear"
        role="button"
        aria-label="clear"
        @click.stop="logic.clear()"
      >
        <slot name="clearIcon">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
            v-html="icons.clear"
          />
        </slot>
      </span>
      <span v-else class="xui-date-picker__icon" aria-hidden="true">
        <slot name="calendarIcon">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="icons.calendar"
          />
        </slot>
      </span>
    </div>
    <div
      v-if="state.open"
      :id="panelId"
      class="xui-date-picker__panel"
      role="dialog"
      :aria-label="locale.datePicker.panel"
    >
      <div class="xui-date-picker__header">
        <button
          type="button"
          class="xui-date-picker__nav"
          :aria-label="locale.datePicker.prevMonth"
          @click="logic.prevMonth()"
        >
          <slot name="prevIcon">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              v-html="icons['arrow-left']"
            />
          </slot>
        </button>
        <span class="xui-date-picker__title">{{ title }}</span>
        <button
          type="button"
          class="xui-date-picker__nav"
          :aria-label="locale.datePicker.nextMonth"
          @click="logic.nextMonth()"
        >
          <slot name="nextIcon">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              v-html="icons['arrow-right']"
            />
          </slot>
        </button>
      </div>
      <div class="xui-date-picker__weekdays" aria-hidden="true">
        <span
          v-for="label in locale.datePicker.weekdays"
          :key="label"
          class="xui-date-picker__weekday"
        >
          {{ label }}
        </span>
      </div>
      <div class="xui-date-picker__grid">
        <button
          v-for="cell in monthCells"
          :key="cell.date"
          type="button"
          class="xui-date-picker__day"
          :class="{
            'is-outside': !cell.inMonth,
            'is-today': cell.isToday,
            'is-selected': cell.date === state.value,
          }"
          :aria-label="cell.date"
          @click="logic.select(cell.date)"
        >
          {{ cell.day }}
        </button>
      </div>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
