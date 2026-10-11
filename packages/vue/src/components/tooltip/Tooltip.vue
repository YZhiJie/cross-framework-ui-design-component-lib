<script setup lang="ts">
import { nextTick, onUnmounted, ref, useId, watch, watchEffect } from 'vue';
import {
  bindViewportUpdate,
  createTooltipLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui/shared';
import type { FloatingPlacement } from '@xui/shared';
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
  unbindViewport?.();
});

// Props 变更同步到逻辑层（运行时禁用会收起已展开的提示框）
watchEffect(() => {
  logic.updateOptions({ disabled: props.disabled });
});

// 视口避让：实际方位（可能翻转）与交叉轴 shift（px）
const triggerRef = ref<HTMLElement | null>(null);
const popperRef = ref<HTMLElement | null>(null);
const resolvedPlacement = ref<FloatingPlacement>(props.placement);
const shiftPx = ref(0);
let unbindViewport: (() => void) | null = null;

/** 测量触发器 / 浮层并计算翻转与钳制；浮层未渲染或无布局尺寸（jsdom）时跳过 */
function updatePosition() {
  const triggerEl = triggerRef.value;
  const popperEl = popperRef.value;
  if (!triggerEl || !popperEl) return;
  const popperRect = popperEl.getBoundingClientRect();
  // 零尺寸表示未完成布局（jsdom 环境恒为 0），保持首选方位避免误翻转
  if (popperRect.width === 0 && popperRect.height === 0) return;
  const { placement, shift } = resolveFloatingPosition(
    triggerEl.getBoundingClientRect(),
    popperRect,
    getViewport(),
    { placement: props.placement, gap: 8 },
  );
  resolvedPlacement.value = placement;
  shiftPx.value = shift;
}

watch(
  () => state.value.open,
  (open) => {
    if (open) {
      resolvedPlacement.value = props.placement;
      shiftPx.value = 0;
      nextTick(updatePosition);
      unbindViewport?.();
      unbindViewport = bindViewportUpdate(updatePosition);
    } else {
      unbindViewport?.();
      unbindViewport = null;
    }
  },
);

// 打开期间 placement prop 变化需重新测量
watch(
  () => props.placement,
  () => {
    if (state.value.open) {
      resolvedPlacement.value = props.placement;
      shiftPx.value = 0;
      nextTick(updatePosition);
    }
  },
);

// hover / focus 触发由 trigger prop 门控；监听绑定在根元素上，
// 悬停提示框本身（popper 是 trigger 子节点）不会触发 leave，方便移动指针查看内容
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
    <span
      ref="triggerRef"
      class="xui-tooltip__trigger"
      :aria-describedby="state.open ? popperId : undefined"
    >
      <slot />
      <span
        v-if="state.open"
        ref="popperRef"
        :id="popperId"
        class="xui-tooltip__popper"
        :class="`is-${resolvedPlacement}`"
        :style="
          resolvedPlacement === 'top' || resolvedPlacement === 'bottom'
            ? { marginLeft: `${shiftPx}px` }
            : { marginTop: `${shiftPx}px` }
        "
        role="tooltip"
      >
        <slot name="content">{{ props.content }}</slot>
        <span class="xui-tooltip__arrow" aria-hidden="true" />
      </span>
    </span>
  </span>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
