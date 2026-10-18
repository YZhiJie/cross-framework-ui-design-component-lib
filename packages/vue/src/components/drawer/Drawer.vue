<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { createDrawerLogic, trapFocus as trapFocusIn } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import type { DrawerProps } from '@xui-design/core';

const {
  placement = 'right',
  size = 378,
  title,
  closable = true,
  mask = true,
  maskClosable = true,
  closeOnEsc = true,
  trapFocus = true,
} = defineProps<Omit<DrawerProps, 'visible' | 'defaultVisible' | 'onOpen' | 'onClose'>>();

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const panelRef = useTemplateRef<HTMLDivElement>('panel');

const logic = createDrawerLogic({
  visible: visible.value,
  closable,
  maskClosable,
  closeOnEsc,
  onOpen: () => {
    visible.value = true;
    emit('open');
  },
  onClose: () => {
    visible.value = false;
    emit('close');
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

/** 面板尺寸样式：left/right 为宽度，top/bottom 为高度 */
const panelStyle = computed(() => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  return placement === 'top' || placement === 'bottom'
    ? { height: sizeValue }
    : { width: sizeValue };
});

const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    logic.handleEsc();
  }
};

/** 面板按键：ESC 关闭 + Tab 焦点循环（trapFocus 关闭时不介入） */
const handlePanelKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    logic.handleEsc();
    return;
  }
  if (trapFocus) {
    trapFocusIn(e, e.currentTarget as HTMLElement);
  }
};

/** 打开前记录的焦点元素，关闭时恢复 */
let previouslyFocused: HTMLElement | null = null;

onUnmounted(() => {
  unsubscribe();
  document.removeEventListener('keydown', handleEscKey);
});

watchEffect(() => {
  logic.updateOptions({
    visible: visible.value,
    closable,
    maskClosable,
    closeOnEsc,
  });
});

watch(
  () => state.value.visible,
  (isVisible) => {
    if (isVisible) {
      if (closeOnEsc) {
        document.addEventListener('keydown', handleEscKey);
      }
      // 记录打开前的焦点元素，关闭时归还（焦点恢复）
      previouslyFocused =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      nextTick(() => {
        panelRef.value?.focus();
      });
    } else {
      document.removeEventListener('keydown', handleEscKey);
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  },
);

const open = () => {
  logic.open();
};

const close = () => {
  logic.close();
};

const toggle = () => {
  logic.toggle();
};

const handleMaskClick = () => {
  logic.handleMaskClick();
};

// 暴露命令式 open/close/toggle（与 React 适配层的 DrawerRef 对齐）
defineExpose({ open, close, toggle });
</script>

<template>
  <Teleport to="body">
    <div v-if="state.visible" class="xui-drawer" :class="`xui-drawer--${placement}`">
      <div v-if="mask" class="xui-drawer__overlay" @click="handleMaskClick" />
      <div
        ref="panel"
        class="xui-drawer__panel"
        :class="className"
        :style="[panelStyle, style]"
        tabindex="-1"
        @keydown="handlePanelKeydown"
      >
        <div class="xui-drawer__header">
          <slot name="title">
            <span class="xui-drawer__title">{{ title }}</span>
          </slot>
          <button v-if="state.closable" type="button" class="xui-drawer__close" @click="close">
            <slot name="closeIcon">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                v-html="icons.close"
              />
            </slot>
          </button>
        </div>
        <div class="xui-drawer__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="xui-drawer__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
