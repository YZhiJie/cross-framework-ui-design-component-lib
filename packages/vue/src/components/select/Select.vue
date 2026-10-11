<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, useTemplateRef, watchEffect } from 'vue';
import { createSelectLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { SelectProps } from '@xui/core';

const props = withDefaults(defineProps<Omit<SelectProps, 'onChange' | 'onClear'>>(), {
  // 显式 undefined 默认值：未绑定 value 时保持 undefined → 逻辑层进入非受控模式
  // （提供 value 即受控），与 React 端语义对齐
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  disabled: false,
  clearable: false,
  options: undefined,
});

const emit = defineEmits<{
  change: [value: string];
  clear: [];
  'update:value': [value: string];
}>();

const rootRef = useTemplateRef<HTMLElement>('root');
const triggerId = useId();
const listboxId = useId();

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { value, defaultValue, options, disabled, clearable } = props;

const logic = createSelectLogic({
  value,
  defaultValue,
  options,
  disabled,
  clearable,
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
    options: props.options,
    disabled: props.disabled,
    clearable: props.clearable,
  });
});

const selectedOption = computed(() =>
  props.options?.find((option) => option.value === state.value.value),
);

const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (state.value.open) logic.confirmHighlight();
      else logic.toggleOpen();
      break;
    case 'Escape':
      if (state.value.open) {
        event.preventDefault();
        logic.close();
      }
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (state.value.open) logic.moveHighlight(1);
      else logic.toggleOpen();
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (state.value.open) logic.moveHighlight(-1);
      else logic.toggleOpen();
      break;
  }
};
</script>

<template>
  <div
    ref="root"
    class="xui-select"
    :class="{ 'is-disabled': state.disabled, 'is-open': state.open }"
  >
    <div
      :id="triggerId"
      class="xui-select__trigger"
      role="combobox"
      :aria-expanded="state.open"
      aria-haspopup="listbox"
      :aria-controls="state.open ? listboxId : undefined"
      :aria-activedescendant="
        state.open && state.activeIndex !== -1
          ? `${listboxId}-option-${state.activeIndex}`
          : undefined
      "
      :aria-disabled="state.disabled || undefined"
      :tabindex="state.disabled ? -1 : 0"
      @click="logic.toggleOpen()"
      @keydown="handleTriggerKeydown"
    >
      <span v-if="selectedOption" class="xui-select__value">{{ selectedOption.label }}</span>
      <span v-else class="xui-select__placeholder">{{ props.placeholder ?? '请选择' }}</span>
      <span
        v-if="props.clearable && state.value !== null && !state.disabled"
        class="xui-select__clear"
        role="button"
        aria-label="clear"
        @click.stop="logic.clear()"
      >
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
      </span>
      <span v-else class="xui-select__arrow" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="icons['arrow-down']"
        />
      </span>
    </div>
    <ul
      v-if="state.open"
      :id="listboxId"
      class="xui-select__dropdown"
      role="listbox"
      :aria-labelledby="triggerId"
    >
      <li
        v-for="(option, index) in props.options"
        :id="`${listboxId}-option-${index}`"
        :key="option.value"
        class="xui-select__option"
        :class="{
          'is-selected': option.value === state.value,
          'is-active': index === state.activeIndex,
          'is-disabled': option.disabled,
        }"
        role="option"
        :aria-selected="option.value === state.value"
        :aria-disabled="option.disabled || undefined"
        @click="logic.select(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
