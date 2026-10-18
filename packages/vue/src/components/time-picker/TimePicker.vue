<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue';
import {
  createTimePickerLogic,
  genTimeColumn,
  parseTimeString,
  snapToStep,
} from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLocaleData } from '../../hooks/use-locale';
import type { TimePickerProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<TimePickerProps, 'onChange' | 'onClear'>>(), {
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  disabled: false,
  clearable: false,
  format: 'HH:mm:ss',
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
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

const logic = createTimePickerLogic({
  value,
  defaultValue,
  disabled,
  format: props.format,
  hourStep: props.hourStep,
  minuteStep: props.minuteStep,
  secondStep: props.secondStep,
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

// 面板打开时，将各列滚动到当前选中项（滚轮选择器定位到视觉中心）
watch(
  () => state.value.open,
  async (open) => {
    if (!open) return;
    await nextTick();
    const columns = rootRef.value?.querySelectorAll<HTMLElement>('.xui-time-picker__column');
    columns?.forEach((col) => {
      const selected = col.querySelector<HTMLElement>('.xui-time-picker__item.is-selected');
      if (selected && typeof selected.scrollIntoView === 'function') {
        selected.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
    });
  },
);

const hours = computed(() => genTimeColumn(24, props.hourStep));
const minutes = computed(() => genTimeColumn(60, props.minuteStep));
const seconds = computed(() => genTimeColumn(60, props.secondStep));

// 当前选中值解析，用于高亮
const parsed = computed(() => (state.value.value ? parseTimeString(state.value.value) : null));
const showSeconds = computed(() => props.format === 'HH:mm:ss');

// 显示文案：按 format 决定是否省略秒
const displayValue = computed(() => {
  if (!state.value.value) return null;
  return showSeconds.value ? state.value.value : state.value.value.slice(0, 5);
});

// 面板文案取全局语言包
const locale = useLocaleData();

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

// 点击某列数字：若未选完整时分秒，则补全其余列后选中
const handlePick = (col: 'hour' | 'minute' | 'second', num: number) => {
  const cur = parsed.value ?? { hour: 0, minute: 0, second: 0 };
  const next = { ...cur, [col]: num };
  logic.select(next.hour, next.minute, showSeconds.value ? next.second : 0);
};

// 暴露命令式 focus / toggleOpen / close（与 React 适配层的 TimePickerRef 对齐）
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
    class="xui-time-picker"
    :class="[className, { 'is-disabled': state.disabled, 'is-open': state.open }]"
    :style="style"
  >
    <div
      ref="trigger"
      :id="triggerId"
      class="xui-time-picker__trigger"
      role="combobox"
      :aria-expanded="state.open"
      aria-haspopup="dialog"
      :aria-controls="state.open ? panelId : undefined"
      :aria-disabled="state.disabled || undefined"
      :tabindex="state.disabled ? -1 : 0"
      @click="logic.toggleOpen()"
      @keydown="handleTriggerKeydown"
    >
      <span v-if="displayValue" class="xui-time-picker__value">{{ displayValue }}</span>
      <span v-else class="xui-time-picker__placeholder">{{
        props.placeholder ?? locale.timePicker.placeholder
      }}</span>
      <span
        v-if="props.clearable && state.value && !state.disabled"
        class="xui-time-picker__clear"
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
      <span v-else class="xui-time-picker__icon" aria-hidden="true">
        <slot name="clockIcon">
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
            v-html="icons.clock"
          />
        </slot>
      </span>
    </div>
    <div
      v-if="state.open"
      :id="panelId"
      class="xui-time-picker__panel"
      role="dialog"
      :aria-label="locale.timePicker.panel"
    >
      <div class="xui-time-picker__columns">
        <ul class="xui-time-picker__column" role="listbox" aria-label="hour">
          <li
            v-for="h in hours"
            :key="h"
            class="xui-time-picker__item"
            :class="{
              'is-selected': parsed?.hour === snapToStep(h, props.hourStep, 24),
            }"
            role="option"
            :aria-selected="parsed?.hour === h"
            @click="handlePick('hour', h)"
          >
            {{ String(h).padStart(2, '0') }}
          </li>
        </ul>
        <ul class="xui-time-picker__column" role="listbox" aria-label="minute">
          <li
            v-for="m in minutes"
            :key="m"
            class="xui-time-picker__item"
            :class="{
              'is-selected': parsed?.minute === snapToStep(m, props.minuteStep, 60),
            }"
            role="option"
            :aria-selected="parsed?.minute === m"
            @click="handlePick('minute', m)"
          >
            {{ String(m).padStart(2, '0') }}
          </li>
        </ul>
        <ul v-if="showSeconds" class="xui-time-picker__column" role="listbox" aria-label="second">
          <li
            v-for="s in seconds"
            :key="s"
            class="xui-time-picker__item"
            :class="{
              'is-selected': parsed?.second === snapToStep(s, props.secondStep, 60),
            }"
            role="option"
            :aria-selected="parsed?.second === s"
            @click="handlePick('second', s)"
          >
            {{ String(s).padStart(2, '0') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
