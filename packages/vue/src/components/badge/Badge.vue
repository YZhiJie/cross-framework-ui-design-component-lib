<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createBadgeLogic } from '@xui/shared';
import type { BadgeProps } from '@xui/core';

const props = withDefaults(defineProps<BadgeProps>(), {
  count: undefined,
  max: 99,
  dot: false,
  showZero: false,
});

const logic = createBadgeLogic({
  count: props.count,
  max: props.max,
  dot: props.dot,
  showZero: props.showZero,
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（可见性与文本派生在逻辑层完成）
watchEffect(() => {
  logic.updateOptions({
    count: props.count,
    max: props.max,
    dot: props.dot,
    showZero: props.showZero,
  });
});
</script>

<template>
  <!-- 包裹模式：徽标叠加在内容右上角 -->
  <span v-if="$slots.default" class="xui-badge" :class="className" :style="style">
    <slot />
    <sup
      v-if="state.visible"
      :class="['xui-badge__sup', { 'is-dot': props.dot }]"
      :aria-hidden="props.dot || undefined"
    >
      {{ state.text }}
    </sup>
  </span>
  <!-- 独立模式：无包裹内容时徽标单独渲染 -->
  <sup
    v-else-if="state.visible"
    :class="['xui-badge__sup', 'xui-badge__sup--standalone', { 'is-dot': props.dot }]"
    :aria-hidden="props.dot || undefined"
  >
    {{ state.text }}
  </sup>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
