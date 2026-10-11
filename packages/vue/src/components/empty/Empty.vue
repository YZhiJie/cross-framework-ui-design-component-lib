<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createEmptyLogic } from '@xui/shared';
import { icons } from '@xui/icons';
import type { EmptyProps } from '@xui/core';

const props = withDefaults(defineProps<EmptyProps>(), {
  description: undefined,
});

const logic = createEmptyLogic({
  description: props.description,
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（空白归一化在逻辑层完成）
watchEffect(() => {
  logic.updateOptions({
    description: props.description,
  });
});
</script>

<template>
  <div class="xui-empty" :class="className" :style="style">
    <div class="xui-empty__image" aria-hidden="true">
      <slot name="image">
        <svg
          class="xui-empty__svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="icons.inbox"
        />
      </slot>
    </div>
    <div v-if="state.description" class="xui-empty__description">{{ state.description }}</div>
    <div v-if="$slots.default" class="xui-empty__footer">
      <slot />
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
