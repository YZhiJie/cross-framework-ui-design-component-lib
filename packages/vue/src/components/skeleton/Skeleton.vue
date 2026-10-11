<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createSkeletonLogic } from '@xui/shared';
import type { SkeletonProps } from '@xui/core';

const props = withDefaults(defineProps<SkeletonProps>(), {
  loading: true,
  avatar: false,
  rows: 3,
});

const logic = createSkeletonLogic({
  loading: props.loading,
  avatar: props.avatar,
  rows: props.rows,
});

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（rows 收敛在逻辑层完成）
watchEffect(() => {
  logic.updateOptions({
    loading: props.loading,
    avatar: props.avatar,
    rows: props.rows,
  });
});
</script>

<template>
  <!-- 真实内容：loading=false 时渲染 default 插槽 -->
  <slot v-if="!state.loading" />
  <!-- 骨架占位：头像 + 段落行（末行短宽度） -->
  <div v-else class="xui-skeleton" role="status" aria-label="加载中">
    <span v-if="state.avatar" class="xui-skeleton__avatar" aria-hidden="true" />
    <div class="xui-skeleton__rows" aria-hidden="true">
      <span
        v-for="n in state.rows"
        :key="n"
        class="xui-skeleton__row"
        :class="{ 'is-last': n === state.rows }"
      />
    </div>
  </div>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
