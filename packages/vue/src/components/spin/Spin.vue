<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createSpinLogic } from '@xui-design/shared';
import type { SpinProps } from '@xui-design/core';

const props = withDefaults(defineProps<SpinProps>(), {
  size: 'md',
  spinning: true,
  tip: undefined,
});

const logic = createSpinLogic({
  size: props.size,
  spinning: props.spinning,
  tip: props.tip,
});

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（size / spinning / tip 收敛在逻辑层完成）
watchEffect(() => {
  logic.updateOptions({
    size: props.size,
    spinning: props.spinning,
    tip: props.tip,
  });
});
</script>

<template>
  <!-- 包裹模式：内容 + 加载遮罩 -->
  <div v-if="$slots.default" class="xui-spin xui-spin--wrapper" :class="className" :style="style">
    <div class="xui-spin__content" :class="{ 'is-blur': state.spinning }">
      <slot />
    </div>
    <div v-if="state.spinning" class="xui-spin__mask" role="status" aria-live="polite">
      <span class="xui-spin__indicator" :class="`is-${state.size}`" aria-hidden="true" />
      <span v-if="state.tip" class="xui-spin__tip">{{ state.tip }}</span>
    </div>
  </div>
  <!-- 独立模式：无包裹内容时单独渲染指示器（spinning=false 不渲染） -->
  <span
    v-else-if="state.spinning"
    class="xui-spin"
    :class="className"
    :style="style"
    role="status"
    aria-live="polite"
  >
    <span class="xui-spin__indicator" :class="`is-${state.size}`" aria-hidden="true" />
    <span v-if="state.tip" class="xui-spin__tip">{{ state.tip }}</span>
  </span>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
