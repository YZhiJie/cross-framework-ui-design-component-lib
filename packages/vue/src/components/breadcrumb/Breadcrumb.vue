<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createBreadcrumbLogic } from '@xui/shared';
import { useLocaleData } from '../../hooks/use-locale';
import type { BreadcrumbItem, BreadcrumbProps } from '@xui/core';

const props = withDefaults(defineProps<Omit<BreadcrumbProps, 'onItemClick'>>(), {
  items: undefined,
  separator: '/',
});

const emit = defineEmits<{ itemClick: [item: BreadcrumbItem, index: number] }>();

// 导航 aria-label 取全局语言包（setLocale / registerLocale 后响应式更新）
const locale = useLocaleData();

const logic = createBreadcrumbLogic({
  items: props.items,
  separator: props.separator,
  onItemClick: (item, index) => emit('itemClick', item, index),
});

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（末项判定 / 可点击守卫在逻辑层完成）
watchEffect(() => {
  logic.updateOptions({
    items: props.items,
    separator: props.separator,
  });
});
</script>

<template>
  <!-- 自定义内容区：default 插槽覆盖 items 渲染 -->
  <nav
    v-if="$slots.default"
    class="xui-breadcrumb"
    :class="className"
    :style="style"
    :aria-label="locale.breadcrumb.nav"
  >
    <slot />
  </nav>
  <nav
    v-else
    class="xui-breadcrumb"
    :class="className"
    :style="style"
    :aria-label="locale.breadcrumb.nav"
  >
    <ol class="xui-breadcrumb__list">
      <li
        v-for="(item, index) in state.items"
        :key="index"
        class="xui-breadcrumb__item"
        :class="{
          'is-active': index === state.items.length - 1,
          'is-disabled': item.disabled,
        }"
      >
        <a
          v-if="item.href && index !== state.items.length - 1 && !item.disabled"
          class="xui-breadcrumb__link"
          :href="item.href"
          @click="logic.selectItem(index)"
          >{{ item.label }}</a
        >
        <span
          v-else
          class="xui-breadcrumb__label"
          :aria-current="index === state.items.length - 1 ? 'page' : undefined"
          @click="logic.selectItem(index)"
          >{{ item.label }}</span
        >
        <span
          v-if="index !== state.items.length - 1"
          class="xui-breadcrumb__separator"
          aria-hidden="true"
          >{{ state.separator }}</span
        >
      </li>
    </ol>
  </nav>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
