<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createButtonLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { ButtonProps } from '@xui/core';

const {
  type = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  block = false,
} = defineProps<Omit<ButtonProps, 'onClick'>>();

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const logic = createButtonLogic({
  disabled,
  loading,
  onClick: (event) => emit('click', event),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

watchEffect(() => {
  logic.updateOptions({
    disabled,
    loading,
  });
});

const handleClick = (event: MouseEvent) => {
  logic.handleClick(event);
};
</script>

<template>
  <button
    :class="[
      className,
      'xui-button',
      `xui-button--${type}`,
      `xui-button--${size}`,
      {
        'is-disabled': state.disabled,
        'is-loading': state.loading,
        'is-block': block,
      },
    ]"
    :style="style"
    :disabled="state.disabled || state.loading"
    @click="handleClick"
  >
    <span v-if="state.loading" class="xui-button__loading-icon">
      <slot name="loadingIcon">
        <svg
          class="xui-button__spinner"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          v-html="icons.loading"
        />
      </slot>
    </span>
    <span v-if="!state.loading && $slots.icon" class="xui-button__icon">
      <slot name="icon" />
    </span>
    <span class="xui-button__content">
      <slot />
    </span>
  </button>
</template>

<style>
.xui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--xui-color-border, #d1d5db);
  border-radius: var(--xui-radius-md, 6px);
  background-color: var(--xui-color-bg, #fff);
  color: var(--xui-color-text, #1f2937);
  font-size: var(--xui-font-size-md, 14px);
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
  user-select: none;
  white-space: nowrap;
}

.xui-button:hover {
  border-color: var(--xui-color-primary, #4f46e5);
  color: var(--xui-color-primary, #4f46e5);
}

.xui-button:active {
  border-color: var(--xui-color-primary-active, #3730a3);
}

.xui-button.is-disabled,
.xui-button:disabled {
  background-color: var(--xui-color-bg-disabled, #f3f4f6);
  border-color: var(--xui-color-border, #d1d5db);
  color: var(--xui-color-text-secondary, #6b7280);
  cursor: not-allowed;
}

.xui-button.is-disabled:hover,
.xui-button:disabled:hover {
  border-color: var(--xui-color-border, #d1d5db);
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-button.is-loading {
  cursor: progress;
}

.xui-button--primary {
  background-color: var(--xui-color-primary, #4f46e5);
  border-color: var(--xui-color-primary, #4f46e5);
  color: #fff;
}

.xui-button--primary:hover {
  background-color: var(--xui-color-primary-hover, #4338ca);
  border-color: var(--xui-color-primary-hover, #4338ca);
  color: #fff;
}

.xui-button--primary:active {
  background-color: var(--xui-color-primary-active, #3730a3);
  border-color: var(--xui-color-primary-active, #3730a3);
}

.xui-button--primary.is-disabled,
.xui-button--primary:disabled {
  background-color: var(--xui-color-bg-disabled, #f3f4f6);
  border-color: var(--xui-color-border, #d1d5db);
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-button--danger {
  background-color: #dc2626;
  border-color: #dc2626;
  color: #fff;
}

.xui-button--danger:hover {
  background-color: #b91c1c;
  border-color: #b91c1c;
  color: #fff;
}

.xui-button--danger:active {
  background-color: #991b1b;
  border-color: #991b1b;
}

.xui-button--danger.is-disabled,
.xui-button--danger:disabled {
  background-color: var(--xui-color-bg-disabled, #f3f4f6);
  border-color: var(--xui-color-border, #d1d5db);
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-button--link {
  background-color: transparent;
  border-color: transparent;
  color: var(--xui-color-primary, #4f46e5);
  padding: 0;
  height: auto;
}

.xui-button--link:hover {
  background-color: transparent;
  border-color: transparent;
  color: var(--xui-color-primary-hover, #4338ca);
}

.xui-button--link:active {
  background-color: transparent;
  border-color: transparent;
  color: var(--xui-color-primary-active, #3730a3);
}

.xui-button--link.is-disabled,
.xui-button--link:disabled {
  background-color: transparent;
  border-color: transparent;
  color: var(--xui-color-text-secondary, #6b7280);
}

.xui-button--sm {
  height: 24px;
  padding: 0 8px;
  font-size: var(--xui-font-size-sm, 12px);
}

.xui-button--md {
  height: 32px;
  padding: 0 16px;
  font-size: var(--xui-font-size-md, 14px);
}

.xui-button--lg {
  height: 40px;
  padding: 0 20px;
  font-size: var(--xui-font-size-lg, 16px);
}

.xui-button.is-block {
  display: flex;
  width: 100%;
}

.xui-button__spinner {
  animation: xui-button-spin 0.8s linear infinite;
}

.xui-button__icon,
.xui-button__loading-icon,
.xui-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@keyframes xui-button-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
