<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createSwitchLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { SwitchProps } from '@xui/core';

const { value, defaultValue, size, disabled, loading } = withDefaults(
  defineProps<Omit<SwitchProps, 'onChange'>>(),
  {
    // 显式 undefined 默认值：跳过 Vue 对缺省 Boolean prop 的 false 转换，
    // 未绑定 value 时保持 undefined → 逻辑层进入非受控模式（defaultValue 生效），
    // 与 React 端语义对齐（提供 value 即受控）。
    // 注意：默认值必须写在 withDefaults 第二参数才会编译进 props 选项，
    // 解构模式中的等号默认值只是 setup 局部回退（contract-test 会校验）
    value: undefined,
    defaultValue: undefined,
    size: 'md',
    disabled: false,
    loading: false,
  },
);

const emit = defineEmits<{
  change: [value: boolean];
  'update:value': [value: boolean];
}>();

const logic = createSwitchLogic({
  value,
  defaultValue,
  disabled,
  loading,
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
    value,
    disabled,
    loading,
  });
});

const handleToggle = () => {
  logic.toggle();
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :class="[
      'xui-switch',
      `xui-switch--${size}`,
      {
        'is-checked': state.checked,
        'is-disabled': state.disabled,
        'is-loading': state.loading,
      },
    ]"
    :aria-checked="state.checked"
    :aria-disabled="state.disabled || state.loading"
    :disabled="state.disabled || state.loading"
    @click="handleToggle"
  >
    <span class="xui-switch__core">
      <span class="xui-switch__thumb">
        <svg
          v-if="state.loading"
          class="xui-switch__spinner"
          viewBox="0 0 24 24"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          v-html="icons.loading"
        />
      </span>
    </span>
  </button>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
