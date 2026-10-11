<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createAlertLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { AlertProps } from '@xui/core';

const {
  type = 'info',
  title,
  description,
  closable = false,
  showIcon = false,
} = defineProps<Omit<AlertProps, 'onClose'>>();

const emit = defineEmits<{ close: [] }>();

const logic = createAlertLogic({
  closable,
  onClose: () => emit('close'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

watchEffect(() => {
  logic.updateOptions({ closable });
});

const handleClose = () => {
  logic.handleClose();
};
</script>

<template>
  <div
    v-if="state.visible"
    :class="[className, 'xui-alert', `xui-alert--${type}`]"
    :style="style"
    role="alert"
  >
    <div v-if="showIcon" class="xui-alert__icon" aria-hidden="true">
      <slot name="icon">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="icons[type]"
        />
      </slot>
    </div>
    <div class="xui-alert__content">
      <div v-if="title || $slots.title" class="xui-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.default || description" class="xui-alert__description">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button
      v-if="state.closable"
      type="button"
      class="xui-alert__close"
      aria-label="close"
      @click="handleClose"
    >
      <slot name="closeIcon">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          v-html="icons.close"
        />
      </slot>
    </button>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
