<script setup lang="ts">
import { onUnmounted, ref, useId, watchEffect } from 'vue';
import { createTooltipLogic } from '@xui/shared';
import type { TooltipProps } from '@xui/core';

const props = withDefaults(defineProps<TooltipProps>(), {
  content: undefined,
  placement: 'top',
  trigger: 'hover',
  disabled: false,
});

const popperId = useId();

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { disabled } = props;

const logic = createTooltipLogic({ disabled });

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（运行时禁用会收起已展开的提示框）
watchEffect(() => {
  logic.updateOptions({ disabled: props.disabled });
});

// hover / focus 触发由 trigger prop 门控；监听绑定在根元素上，
// 悬停提示框本身（popper 是根元素子节点）不会触发 leave，方便移动指针查看内容
const handleEnter = () => {
  if (props.trigger === 'hover') logic.show();
};
const handleLeave = () => {
  if (props.trigger === 'hover') logic.hide();
};
const handleFocus = () => {
  if (props.trigger === 'focus') logic.show();
};
const handleBlur = () => {
  if (props.trigger === 'focus') logic.hide();
};
</script>

<template>
  <span
    class="xui-tooltip"
    :class="className"
    :style="style"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @focusin="handleFocus"
    @focusout="handleBlur"
  >
    <span class="xui-tooltip__trigger" :aria-describedby="state.open ? popperId : undefined">
      <slot />
      <span
        v-if="state.open"
        :id="popperId"
        class="xui-tooltip__popper"
        :class="`is-${props.placement}`"
        role="tooltip"
      >
        <slot name="content">{{ props.content }}</slot>
        <span class="xui-tooltip__arrow" aria-hidden="true" />
      </span>
    </span>
  </span>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
