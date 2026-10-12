<script setup lang="ts">
import { onUnmounted, ref, useTemplateRef, watchEffect } from 'vue';
import { createInputNumberLogic } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { InputNumberProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<InputNumberProps, 'onChange'>>(), {
  value: undefined,
  defaultValue: undefined,
  min: undefined,
  max: undefined,
  step: 1,
  precision: undefined,
  disabled: false,
  placeholder: undefined,
});

const emit = defineEmits<{
  change: [value: number | null];
  'update:value': [value: number | null];
}>();

const logic = createInputNumberLogic({
  value: props.value,
  defaultValue: props.defaultValue,
  min: props.min,
  max: props.max,
  step: props.step,
  precision: props.precision,
  disabled: props.disabled,
  onChange: (value) => {
    emit('change', value);
    emit('update:value', value);
  },
});

const state = ref(logic.getState());

/** 收敛值的显示文本（precision 存在时固定小数位） */
function formatValue(value: number | null): string {
  if (value === null) return '';
  const precision = logic.getState().precision;
  return precision !== null ? value.toFixed(precision) : String(value);
}

// 输入框显示文本：编辑期自由文本，提交 / 外部同步后与收敛值对齐
const inputText = ref(formatValue(state.value.value));

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
  // 非受控内部更新（提交 / 步进）后对齐显示
  if (props.value === undefined) {
    inputText.value = formatValue(next.value);
  }
});
onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层；受控值（undefined 之外，null 也是有效值）驱动显示
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    min: props.min,
    max: props.max,
    step: props.step,
    precision: props.precision,
    disabled: props.disabled,
  });
  if (props.value !== undefined) {
    inputText.value = formatValue(state.value.value);
  }
});

function onCommit() {
  logic.commitText(inputText.value);
  // 提交后以逻辑收敛值对齐显示（受控时为受控收敛值）
  inputText.value = formatValue(state.value.value);
}

function onStep(direction: 1 | -1) {
  logic.stepValue(direction);
  inputText.value = formatValue(state.value.value);
}

const inputRef = useTemplateRef<HTMLInputElement>('input');

// 暴露命令式 focus / blur / stepValue（与 React 适配层的 InputNumberRef 对齐）
const focus = () => {
  inputRef.value?.focus();
};

const blur = () => {
  inputRef.value?.blur();
};

const stepValue = (direction: 1 | -1) => {
  logic.stepValue(direction);
  inputText.value = formatValue(state.value.value);
};

defineExpose({ focus, blur, stepValue });
</script>

<template>
  <div
    class="xui-input-number"
    :class="[className, { 'is-disabled': state.disabled }]"
    :style="style"
  >
    <input
      ref="input"
      v-model="inputText"
      class="xui-input-number__input"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :aria-valuenow="state.value ?? undefined"
      :aria-valuemin="Number.isFinite(state.min) ? state.min : undefined"
      :aria-valuemax="Number.isFinite(state.max) ? state.max : undefined"
      :placeholder="props.placeholder"
      :disabled="state.disabled"
      @change="onCommit"
      @keydown.enter.prevent="onCommit"
      @keydown.up.prevent="onStep(1)"
      @keydown.down.prevent="onStep(-1)"
    />
    <div class="xui-input-number__step" aria-hidden="true">
      <button
        class="xui-input-number__btn"
        type="button"
        tabindex="-1"
        :disabled="state.disabled"
        @click="onStep(1)"
      >
        <slot name="upIcon">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="icons['arrow-up']"
          />
        </slot>
      </button>
      <button
        class="xui-input-number__btn"
        type="button"
        tabindex="-1"
        :disabled="state.disabled"
        @click="onStep(-1)"
      >
        <slot name="downIcon">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="icons['arrow-down']"
          />
        </slot>
      </button>
    </div>
  </div>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
