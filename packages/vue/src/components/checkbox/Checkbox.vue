<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createCheckboxLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { CheckboxProps } from '@xui/core';

const props = withDefaults(defineProps<Omit<CheckboxProps, 'onChange'>>(), {
  // 显式 undefined 默认值：跳过 Vue 对缺省 Boolean prop 的 false 转换，
  // 未绑定 value 时保持 undefined → 逻辑层进入非受控模式（defaultValue 生效），
  // 与 React 端语义对齐（提供 value 即受控）。
  // 注意：默认值必须写在 withDefaults 第二参数才会编译进 props 选项，
  // 解构模式中的等号默认值只是 setup 局部回退（contract-test 会校验）
  value: undefined,
  defaultValue: undefined,
  disabled: false,
  indeterminate: false,
});

// setup 仅执行一次：解构 props 是一次性快照（withDefaults + 解构会禁用响应式解构），
// 仅用于逻辑层初始化；后续 Props 变更必须经 props.xxx 响应式访问同步到逻辑层
const { value, defaultValue, disabled, indeterminate } = props;

const emit = defineEmits<{
  change: [value: boolean];
  'update:value': [value: boolean];
}>();

const logic = createCheckboxLogic({
  value,
  defaultValue,
  disabled,
  indeterminate,
  onChange: (value) => {
    emit('update:value', value);
    emit('change', value);
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（受控模式：value 变更 → 逻辑层）
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    disabled: props.disabled,
    indeterminate: props.indeterminate,
  });
});

const handleChange = () => {
  logic.toggle();
};
</script>

<template>
  <label
    :class="[
      className,
      'xui-checkbox',
      {
        'is-checked': state.checked,
        'is-disabled': state.disabled,
        'is-indeterminate': state.indeterminate,
      },
    ]"
    :style="style"
  >
    <input
      class="xui-checkbox__input"
      type="checkbox"
      :checked="state.checked"
      :disabled="state.disabled"
      :indeterminate.prop="state.indeterminate"
      :aria-disabled="state.disabled"
      @change="handleChange"
    />
    <span class="xui-checkbox__box" aria-hidden="true">
      <slot v-if="state.indeterminate" name="indeterminateIcon">
        <svg
          class="xui-checkbox__icon"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          v-html="icons.minus"
        />
      </slot>
      <slot v-else-if="state.checked" name="checkIcon">
        <svg
          class="xui-checkbox__icon"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          v-html="icons.check"
        />
      </slot>
    </span>
    <span v-if="$slots.default" class="xui-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
