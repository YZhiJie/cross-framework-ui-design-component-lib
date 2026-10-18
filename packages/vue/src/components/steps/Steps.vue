<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue';
import { icons } from '@xui-design/icons';
import { createStepsLogic } from '@xui-design/shared';
import type { StepStatus } from '@xui-design/shared';
import type { StepsProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<StepsProps, 'onChange'>>(), {
  value: undefined,
  defaultValue: undefined,
  status: undefined,
  direction: 'horizontal',
});

const emit = defineEmits<{
  change: [index: number];
  'update:value': [index: number];
}>();

const logic = createStepsLogic({
  items: props.items,
  value: props.value,
  defaultValue: props.defaultValue,
  status: props.status,
  direction: props.direction,
  onChange: (index) => {
    emit('update:value', index);
    emit('change', index);
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层
watchEffect(() => {
  logic.updateOptions({
    items: props.items,
    value: props.value,
    status: props.status,
    direction: props.direction,
  });
});

// 每个步骤的展示状态（显式引用 state.value 让 computed 收集依赖）
const statuses = computed<StepStatus[]>(() => {
  void state.value.value;
  return props.items.map((_, index) => logic.getStatus(index));
});

defineExpose({
  next: () => logic.next(),
  prev: () => logic.prev(),
  goTo: (index: number) => logic.select(index),
});
</script>

<template>
  <div class="xui-steps" :class="[className, `is-${state.direction}`]" :style="style">
    <div
      v-for="(item, index) in items"
      :key="item.key"
      class="xui-steps__item"
      :class="[
        `is-${statuses[index]}`,
        {
          'is-disabled': item.disabled,
          'is-current': index === state.value,
        },
      ]"
      role="listitem"
      :aria-current="index === state.value ? 'step' : undefined"
      :aria-disabled="item.disabled || undefined"
      @click="logic.select(index)"
    >
      <!-- 连接线（首项不渲染） -->
      <span
        v-if="index > 0"
        class="xui-steps__line"
        :class="{ 'is-finished': statuses[index] === 'finish' }"
      />
      <!-- 图标：finish 对勾 / error 叉 / 其余数字 -->
      <span class="xui-steps__icon">
        <svg
          v-if="statuses[index] === 'finish'"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icons.check"
        />
        <svg
          v-else-if="statuses[index] === 'error'"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
          v-html="icons.close"
        />
        <span v-else class="xui-steps__index">{{ index + 1 }}</span>
      </span>
      <span class="xui-steps__body">
        <span class="xui-steps__title">{{ item.title }}</span>
        <span v-if="item.description" class="xui-steps__description">{{ item.description }}</span>
      </span>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
