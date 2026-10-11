<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createAvatarLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { AvatarProps } from '@xui/core';

const props = withDefaults(defineProps<Omit<AvatarProps, 'onError'>>(), {
  size: 'md',
  shape: 'circle',
  src: undefined,
  alt: undefined,
});

const emit = defineEmits<{
  error: [];
}>();

const logic = createAvatarLogic({
  src: props.src,
  onError: () => {
    emit('error');
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（src 变更时逻辑层重置失败态）
watchEffect(() => {
  logic.updateOptions({
    src: props.src,
  });
});
</script>

<template>
  <span :class="['xui-avatar', `xui-avatar--${props.size}`, `xui-avatar--${props.shape}`]">
    <img
      v-if="props.src && !state.failed"
      class="xui-avatar__img"
      :src="props.src"
      :alt="props.alt ?? ''"
      @error="logic.handleError()"
    />
    <span v-else-if="$slots.default" class="xui-avatar__inner">
      <slot />
    </span>
    <svg
      v-else
      class="xui-avatar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      v-html="icons.user"
    />
  </span>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
