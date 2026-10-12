<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue';
import { createPageItems, createPaginationLogic } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLocaleData } from '../../hooks/use-locale';
import type { PaginationProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<PaginationProps, 'onChange'>>(), {
  // 显式 undefined 默认值：未绑定 value 时保持 undefined → 逻辑层进入非受控模式
  // （提供 value 即受控），与 React 端语义对齐
  value: undefined,
  defaultValue: undefined,
  total: undefined,
  pageSize: 10,
  disabled: false,
});

const emit = defineEmits<{
  change: [page: number];
  'update:value': [page: number];
}>();

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { value, defaultValue, total, pageSize, disabled } = props;

const logic = createPaginationLogic({
  value,
  defaultValue,
  total,
  pageSize,
  disabled,
  onChange: (page) => {
    emit('update:value', page);
    emit('change', page);
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（受控模式：value 变更 → 逻辑层；total/pageSize 变更重算页数）
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    total: props.total,
    pageSize: props.pageSize,
    disabled: props.disabled,
  });
});

const pageItems = computed(() => createPageItems(state.value.page, state.value.pageCount));

// 导航 aria-label 取全局语言包（setLocale / registerLocale 后响应式更新）
const locale = useLocaleData();

const isNumber = (item: number | 'ellipsis-prev' | 'ellipsis-next'): item is number =>
  typeof item === 'number';
</script>

<template>
  <nav
    class="xui-pagination"
    :class="[className, { 'is-disabled': state.disabled }]"
    :style="style"
    role="navigation"
    :aria-label="locale.pagination.nav"
  >
    <button
      type="button"
      class="xui-pagination__nav"
      :class="{ 'is-prev': true }"
      :disabled="state.disabled || state.page <= 1"
      :aria-label="locale.pagination.prev"
      @click="logic.prev()"
    >
      <slot name="prevIcon">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icons['arrow-left']"
        />
      </slot>
    </button>
    <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
      <button
        v-if="isNumber(item)"
        type="button"
        class="xui-pagination__page"
        :class="{ 'is-active': item === state.page }"
        :aria-current="item === state.page ? 'page' : undefined"
        :disabled="state.disabled"
        @click="logic.goTo(item)"
      >
        {{ item }}
      </button>
      <span v-else class="xui-pagination__ellipsis" aria-hidden="true">···</span>
    </template>
    <button
      type="button"
      class="xui-pagination__nav"
      :disabled="state.disabled || state.page >= state.pageCount"
      :aria-label="locale.pagination.next"
      @click="logic.next()"
    >
      <slot name="nextIcon">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icons['arrow-right']"
        />
      </slot>
    </button>
  </nav>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
