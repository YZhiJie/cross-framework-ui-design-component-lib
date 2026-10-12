<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createSwitchLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { SwitchProps } from '@xui/core';

const props = withDefaults(defineProps<Omit<SwitchProps, 'onChange'>>(), {
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
});

// setup 仅执行一次：解构 props 是一次性快照（withDefaults + 解构会禁用响应式解构），
// 仅用于逻辑层初始化；后续 Props 变更必须经 props.xxx 响应式访问同步到逻辑层
const { value, defaultValue, disabled, loading } = props;

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
    value: props.value,
    disabled: props.disabled,
    loading: props.loading,
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
      className,
      'xui-switch',
      `xui-switch--${props.size}`,
      {
        'is-checked': state.checked,
        'is-disabled': state.disabled,
        'is-loading': state.loading,
        // 双态文本：任一文本提供即进入带文本模式（轨道加宽 + 滑块位移调整）
        'xui-switch--has-text': Boolean(props.checkedText || props.uncheckedText),
      },
    ]"
    :style="style"
    :aria-checked="state.checked"
    :aria-disabled="state.disabled || state.loading"
    :disabled="state.disabled || state.loading"
    @click="handleToggle"
  >
    <span class="xui-switch__core">
      <!-- 双态文本：两文本常驻 DOM，CSS Grid 重叠 + visibility 切换实现宽度自适应较宽文本。
           状态已由 role="switch" + aria-checked 传达，文本对读屏隐藏避免重复朗读 -->
      <span v-if="props.checkedText || props.uncheckedText" class="xui-switch__text-wrap">
        <span
          v-if="props.checkedText"
          class="xui-switch__text xui-switch__text--checked"
          :title="props.checkedText"
          aria-hidden="true"
          >{{ props.checkedText }}</span
        >
        <span
          v-if="props.uncheckedText"
          class="xui-switch__text xui-switch__text--unchecked"
          :title="props.uncheckedText"
          aria-hidden="true"
          >{{ props.uncheckedText }}</span
        >
      </span>
      <span class="xui-switch__thumb">
        <slot v-if="state.loading" name="loadingIcon">
          <svg
            class="xui-switch__spinner"
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            v-html="icons.loading"
          />
        </slot>
      </span>
    </span>
  </button>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
