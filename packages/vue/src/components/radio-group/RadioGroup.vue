<script setup lang="ts">
import { computed, onUnmounted, provide, ref, watchEffect } from 'vue';
import { createRadioGroupLogic } from '@xui/shared';
import type { RadioGroupProps } from '@xui/core';
import Radio from '../radio/Radio.vue';
import { RADIO_GROUP_KEY, createRadioGroupName } from './context';

const props = withDefaults(defineProps<Omit<RadioGroupProps, 'onChange'>>(), {
  // 显式 undefined 默认值：跳过 Vue 对缺省 String prop 的转换，
  // 未绑定 value 时保持 undefined → 逻辑层进入非受控模式（defaultValue 生效），
  // 与 React 端语义对齐（提供 value 即受控）。
  // 注意：默认值必须写在 withDefaults 第二参数才会编译进 props 选项，
  // 解构模式中的等号默认值只是 setup 局部回退（contract-test 会校验）
  value: undefined,
  defaultValue: undefined,
  disabled: false,
  options: undefined,
});

const emit = defineEmits<{
  change: [value: string];
  'update:value': [value: string];
}>();

// setup 仅执行一次：解构 props 是一次性快照（withDefaults + 解构会禁用响应式解构），
// 仅用于逻辑层初始化；后续 Props 变更必须经 props.xxx 响应式访问同步到逻辑层
const { value, defaultValue, disabled } = props;

const logic = createRadioGroupLogic({
  value,
  defaultValue,
  disabled,
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
  });
});

// 组上下文：Radio 子项通过 inject 消费（setup 内仅创建一次）
provide(RADIO_GROUP_KEY, {
  name: createRadioGroupName(),
  groupValue: computed(() => state.value.value),
  groupDisabled: computed(() => state.value.disabled),
  select: (value: string) => {
    logic.select(value);
  },
});
</script>

<template>
  <div class="xui-radio-group" role="radiogroup">
    <!-- options 数组渲染优先；未提供 options 时由 default 插槽渲染 Radio 子项 -->
    <template v-if="props.options && props.options.length > 0">
      <Radio
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </Radio>
    </template>
    <slot v-else />
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
