<script setup lang="ts">
import { computed, inject, onUnmounted, ref, watchEffect } from 'vue';
import { createRadioLogic } from '@xui/shared';
import type { RadioProps } from '@xui/core';
import { RADIO_GROUP_KEY } from '../radio-group/context';

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
});

// Radio 无契约事件（选中变更统一由 RadioGroup 触发 change）
const logic = createRadioLogic({
  disabled: props.disabled,
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层
watchEffect(() => {
  logic.updateOptions({
    disabled: props.disabled,
  });
});

// 组上下文可选：Radio 设计为 RadioGroup 的子项组件，组外渲染仅作兜底（永不选中）
const group = inject(RADIO_GROUP_KEY, null);

const checked = computed(() => (group ? group.groupValue.value === props.value : false));
const disabled = computed(
  () => state.value.disabled || (group ? group.groupDisabled.value : false),
);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // 自身禁用时忽略并恢复勾选态（程序化触发会绕过原生 disabled 行为）
  if (disabled.value) {
    target.checked = checked.value;
    return;
  }
  if (!group) {
    // 组外兜底：保持永不选中，避免原生点击勾选后视觉与状态不一致
    target.checked = false;
    return;
  }
  group.select(props.value);
  // 原生 radio 点击后浏览器已勾选目标项；受控模式外部未回写时组值不变、
  // Vue 无重渲染不会恢复 DOM 状态，这里按最新组值强制同步一次
  target.checked = group.groupValue.value === props.value;
};
</script>

<template>
  <label
    :class="[
      'xui-radio',
      {
        'is-checked': checked,
        'is-disabled': disabled,
      },
    ]"
  >
    <input
      class="xui-radio__input"
      type="radio"
      :name="group?.name"
      :value="props.value"
      :checked="checked"
      :disabled="disabled"
      :aria-disabled="disabled"
      @change="handleChange"
    />
    <span class="xui-radio__dot" aria-hidden="true"></span>
    <span v-if="$slots.default" class="xui-radio__label">
      <slot />
    </span>
  </label>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
