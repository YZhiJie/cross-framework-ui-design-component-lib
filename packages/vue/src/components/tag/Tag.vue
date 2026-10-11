<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createTagLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { TagProps } from '@xui/core';

const {
  type = 'default',
  size = 'md',
  closable = false,
} = defineProps<Omit<TagProps, 'onClose'>>();

const emit = defineEmits<{ close: [] }>();

const logic = createTagLogic({
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
  <span
    v-if="state.visible"
    :class="[className, 'xui-tag', `xui-tag--${type}`, `xui-tag--${size}`]"
    :style="style"
  >
    <slot />
    <button
      v-if="state.closable"
      type="button"
      class="xui-tag__close"
      aria-label="close"
      @click="handleClose"
    >
      <svg
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        v-html="icons.close"
      />
    </button>
  </span>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
