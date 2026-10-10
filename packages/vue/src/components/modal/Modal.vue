<script setup lang="ts">
import { nextTick, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { createModalLogic } from '@xui/shared';
import type { ModalProps } from '@xui/core';

const {
  title,
  width = 520,
  closable = true,
  maskClosable = true,
  closeOnEsc = true,
} = defineProps<
  Omit<ModalProps, 'visible' | 'defaultVisible' | 'onOpen' | 'onClose' | 'onOk' | 'onCancel'>
>();

const emit = defineEmits<{
  open: [];
  close: [];
  ok: [];
  cancel: [];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const panelRef = useTemplateRef<HTMLDivElement>('panel');

const logic = createModalLogic({
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
  onOk: () => emit('ok'),
  onCancel: () => emit('cancel'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    logic.handleEsc();
  }
};

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
    if (isVisible && closeOnEsc) {
      document.addEventListener('keydown', handleEscKey);
      nextTick(() => {
        panelRef.value?.focus();
      });
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }
  },
);

const open = () => {
  logic.open();
};

const close = () => {
  logic.close();
};

const handleOk = () => {
  logic.handleOk();
};

const handleCancel = () => {
  logic.handleCancel();
};

const handleMaskClick = () => {
  logic.handleMaskClick();
};

// 暴露命令式 open/close（与 React 适配层的 ModalRef 对齐，
// 使契约中的 open 事件可达）
defineExpose({ open, close });
</script>

<template>
  <Teleport to="body">
    <div v-if="state.visible" class="xui-modal">
      <div class="xui-modal__overlay" @click="handleMaskClick" />
      <div
        ref="panel"
        class="xui-modal__panel"
        :style="{ width: typeof width === 'number' ? `${width}px` : width }"
        tabindex="-1"
        @keydown.esc.prevent="logic.handleEsc"
      >
        <div class="xui-modal__header">
          <slot name="title">
            <span class="xui-modal__title">{{ title }}</span>
          </slot>
          <button v-if="state.closable" class="xui-modal__close" @click="close">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <div class="xui-modal__body">
          <slot />
        </div>
        <div class="xui-modal__footer">
          <slot name="footer">
            <button class="xui-button xui-button--md" @click="handleCancel">取消</button>
            <button class="xui-button xui-button--primary xui-button--md" @click="handleOk">
              确认
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.xui-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.xui-modal__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
}

.xui-modal__panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  background-color: var(--xui-color-bg, #fff);
  border-radius: var(--xui-radius-lg, 8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  outline: none;
}

.xui-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 20px;
  border-bottom: 1px solid var(--xui-color-border, #d1d5db);
}

.xui-modal__title {
  font-size: var(--xui-font-size-lg, 16px);
  font-weight: 600;
  color: var(--xui-color-text, #1f2937);
}

.xui-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--xui-color-text-secondary, #6b7280);
  cursor: pointer;
  border-radius: var(--xui-radius-sm, 4px);
  transition:
    background-color 0.2s,
    color 0.2s;
}

.xui-modal__close:hover {
  color: var(--xui-color-text, #1f2937);
  background-color: var(--xui-color-bg-disabled, #f3f4f6);
}

.xui-modal__body {
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
  color: var(--xui-color-text, #1f2937);
  font-size: var(--xui-font-size-md, 14px);
}

.xui-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  padding: 12px 20px;
  border-top: 1px solid var(--xui-color-border, #d1d5db);
}
</style>
