<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch, watchEffect } from 'vue';
import {
  bindViewportUpdate,
  createDropdownLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui-design/shared';
import type { DropdownOption, FloatingPlacement } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { DropdownProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<DropdownProps, 'onSelect' | 'onVisibleChange'>>(), {
  trigger: 'hover',
  placement: 'bottom',
  disabled: false,
});

const emit = defineEmits<{
  select: [key: string, option: DropdownOption];
  visibleChange: [open: boolean];
}>();

const rootRef = ref<HTMLElement | null>(null);

const logic = createDropdownLogic({
  menu: props.menu,
  trigger: props.trigger,
  placement: props.placement,
  disabled: props.disabled,
  onSelect: (key, option) => emit('select', key, option),
  onVisibleChange: (open) => emit('visibleChange', open),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

// 点击外部收起（不触发 onSelect）
const handleDocMouseDown = (event: MouseEvent) => {
  const root = rootRef.value;
  if (root && !root.contains(event.target as Node)) logic.close();
};

// Esc 收起（不触发 onSelect）
const handleDocKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && state.value.open) logic.closeMenu();
};

document.addEventListener('mousedown', handleDocMouseDown);
document.addEventListener('keydown', handleDocKeyDown);

// 视口避让：实际方位（可能翻转）与交叉轴 shift（px）
const triggerRef = ref<HTMLElement | null>(null);
const popperRef = ref<HTMLElement | null>(null);
const resolvedPlacement = ref<FloatingPlacement>(props.placement);
const shiftPx = ref(0);
let unbindViewport: (() => void) | null = null;

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
    { placement: state.value.placement, gap: 8 },
  );
  resolvedPlacement.value = placement;
  shiftPx.value = shift;
}

watch(
  () => state.value.open,
  (open) => {
    if (open) {
      resolvedPlacement.value = state.value.placement;
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

// 打开期间 placement prop（经 logic state 同步）变化需重新测量
watch(
  () => state.value.placement,
  (placement) => {
    if (state.value.open) {
      resolvedPlacement.value = placement;
      shiftPx.value = 0;
      nextTick(updatePosition);
    }
  },
);

onUnmounted(() => {
  unsubscribe();
  unbindViewport?.();
  document.removeEventListener('mousedown', handleDocMouseDown);
  document.removeEventListener('keydown', handleDocKeyDown);
});

// Props 变更同步到逻辑层（运行时禁用会收起已开菜单）
watchEffect(() => {
  logic.updateOptions({
    menu: props.menu,
    trigger: props.trigger,
    placement: props.placement,
    disabled: props.disabled,
  });
});

// 图标名 → 内层 SVG 标记（未知名忽略不渲染）
function iconMarkup(name: string | undefined): string | undefined {
  if (!name) return undefined;
  return (icons as Record<string, string>)[name];
}

// 暴露命令式 show / hide / toggle（与 React 适配层的 DropdownRef 对齐）
const show = () => {
  logic.openMenu();
};

const hide = () => {
  logic.closeMenu();
};

const toggle = () => {
  if (state.value.open) {
    logic.closeMenu();
  } else {
    logic.openMenu();
  }
};

defineExpose({ show, hide, toggle });
</script>

<template>
  <span ref="rootRef" class="xui-dropdown" :class="className" :style="style">
    <span
      ref="triggerRef"
      class="xui-dropdown__trigger"
      :class="{ 'is-disabled': state.disabled }"
      :aria-haspopup="state.open ? 'menu' : undefined"
      @click="logic.toggle()"
      @mouseenter="logic.handleTriggerEnter()"
      @mouseleave="logic.handleTriggerLeave()"
    >
      <slot />
      <ul
        v-if="state.open"
        ref="popperRef"
        class="xui-dropdown__menu"
        :class="`is-${resolvedPlacement}`"
        :style="
          resolvedPlacement === 'top' || resolvedPlacement === 'bottom'
            ? { marginLeft: `${shiftPx}px` }
            : { marginTop: `${shiftPx}px` }
        "
        role="menu"
        @mouseenter="logic.handlePopperEnter()"
        @mouseleave="logic.handlePopperLeave()"
        @click.stop
      >
        <li
          v-for="item in menu"
          :key="item.key"
          class="xui-dropdown__item"
          :class="{
            'is-disabled': item.disabled,
            'is-danger': item.danger,
            'is-divided': item.divided,
          }"
          role="menuitem"
          :aria-disabled="item.disabled || undefined"
          @click="logic.select(item.key)"
        >
          <svg
            v-if="iconMarkup(item.icon)"
            class="xui-dropdown__item-icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            v-html="iconMarkup(item.icon)"
          />
          <span class="xui-dropdown__item-label">{{ item.label }}</span>
        </li>
      </ul>
    </span>
  </span>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
