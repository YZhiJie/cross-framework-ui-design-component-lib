<script setup lang="ts">
import { onUnmounted, ref, useId, useTemplateRef, watchEffect } from 'vue';
import { createInputLogic } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { InputProps } from '@xui-design/core';

const {
  type = 'text',
  placeholder,
  disabled = false,
  readonly = false,
  maxLength,
  clearable = false,
} = defineProps<
  Omit<
    InputProps,
    'value' | 'defaultValue' | 'onInput' | 'onChange' | 'onFocus' | 'onBlur' | 'onClear'
  >
>();

const emit = defineEmits<{
  input: [value: string];
  change: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
}>();

const modelValue = defineModel<string>('value', { default: '' });

const inputRef = useTemplateRef<HTMLInputElement>('input');
const inputId = useId();

const logic = createInputLogic({
  value: modelValue.value,
  disabled,
  readonly,
  onInput: (val) => {
    modelValue.value = val;
    emit('input', val);
  },
  onChange: (val) => emit('change', val),
  onFocus: (e) => emit('focus', e),
  onBlur: (e) => emit('blur', e),
  onClear: () => {
    modelValue.value = '';
    emit('clear');
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

watchEffect(() => {
  logic.updateOptions({
    value: modelValue.value,
    disabled,
    readonly,
  });
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  logic.handleInput(target.value);
};

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  logic.handleChange(target.value);
};

const handleFocus = (e: FocusEvent) => {
  logic.handleFocus(e);
};

const handleBlur = (e: FocusEvent) => {
  logic.handleBlur(e);
};

const handleClear = () => {
  logic.handleClear();
};

const focus = () => {
  inputRef.value?.focus();
};

const blur = () => {
  inputRef.value?.blur();
};

defineExpose({ focus, blur, clear: handleClear });
</script>

<template>
  <div
    :class="[
      className,
      'xui-input',
      {
        'is-disabled': state.disabled,
        'is-readonly': state.readonly,
        'is-focused': state.focused,
      },
    ]"
    :style="style"
  >
    <span v-if="$slots.prefix" class="xui-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      :id="inputId"
      ref="input"
      :type="type"
      :value="state.value"
      :placeholder="placeholder"
      :disabled="state.disabled"
      :readonly="state.readonly"
      :maxlength="maxLength"
      class="xui-input__inner"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span
      v-if="clearable && state.value && !state.disabled && !state.readonly"
      class="xui-input__clear"
      @click="handleClear"
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
          v-html="icons.clear"
        />
      </slot>
    </span>
    <span v-if="$slots.suffix" class="xui-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style>
.xui-input {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  border: 1px solid var(--xui-color-border, #d1d5db);
  border-radius: var(--xui-radius-md, 6px);
  background-color: var(--xui-color-bg, #fff);
  transition: border-color 0.2s ease;
}

.xui-input.is-focused {
  border-color: var(--xui-color-primary, #4f46e5);
}

.xui-input.is-disabled {
  background-color: var(--xui-color-bg-disabled, #f3f4f6);
  cursor: not-allowed;
}

.xui-input.is-readonly {
  background-color: var(--xui-color-bg-disabled, #f3f4f6);
}

.xui-input__inner {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 32px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--xui-color-text, #1f2937);
  font-size: var(--xui-font-size-md, 14px);
  font-family: inherit;
  line-height: 1.5;
}

.xui-input__inner:disabled {
  cursor: not-allowed;
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-input__inner::placeholder {
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-input__prefix,
.xui-input__suffix,
.xui-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-input__clear {
  cursor: pointer;
}

.xui-input__clear:hover {
  color: var(--xui-color-text, #1f2937);
}
</style>
