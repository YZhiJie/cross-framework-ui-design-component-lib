<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue';
import { createProgressLogic } from '@xui/shared';
import type { ProgressProps } from '@xui/core';

const props = withDefaults(defineProps<ProgressProps>(), {
  percent: 0,
  type: 'line',
  strokeWidth: 6,
  showText: true,
  status: 'normal',
});

const logic = createProgressLogic({
  percent: props.percent,
  strokeWidth: props.strokeWidth,
  status: props.status,
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（percent 收敛与 status 派生在逻辑层完成）
watchEffect(() => {
  logic.updateOptions({
    percent: props.percent,
    strokeWidth: props.strokeWidth,
    status: props.status,
  });
});

const text = computed(() => `${Math.round(state.value.percent)}%`);

// circle 类型的圆环几何（viewBox 0 0 100 100，12 点方向起始）
const circle = computed(() => {
  const radius = (100 - state.value.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return {
    radius,
    circumference,
    offset: circumference * (1 - state.value.percent / 100),
  };
});
</script>

<template>
  <div
    :class="['xui-progress', `xui-progress--${props.type}`, `is-${state.status}`]"
    role="progressbar"
    :aria-valuenow="Math.round(state.percent)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <template v-if="props.type === 'circle'">
      <svg class="xui-progress__svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          class="xui-progress__track"
          :cx="50"
          :cy="50"
          :r="circle.radius"
          fill="none"
          :stroke-width="state.strokeWidth"
        />
        <circle
          class="xui-progress__bar"
          :cx="50"
          :cy="50"
          :r="circle.radius"
          fill="none"
          :stroke-width="state.strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circle.circumference"
          :stroke-dashoffset="circle.offset"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span v-if="props.showText" class="xui-progress__text xui-progress__text--circle">
        {{ text }}
      </span>
    </template>
    <template v-else>
      <div class="xui-progress__track" :style="{ height: `${state.strokeWidth}px` }">
        <div class="xui-progress__bar" :style="{ width: `${state.percent}%` }"></div>
      </div>
      <span v-if="props.showText" class="xui-progress__text">{{ text }}</span>
    </template>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
