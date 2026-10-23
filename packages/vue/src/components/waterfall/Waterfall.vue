<script setup lang="ts">
/**
 * Waterfall - Vue 3 适配层
 *
 * 核心链路：
 *  1. ResizeObserver 监听容器宽度 → rAF 合并 → 用 breakpoints 算新列数 → logic.setColumnCount()
 *  2. ResizeObserver 监听每个 item 高度变化（图片加载、内容变化）→ logic.updateItemHeight()
 *  3. 两者都触发重排，rAF 合并保证一帧内多次变更只执行一次 doLayout
 */

import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import type { VNodeRef } from 'vue';
import { createWaterfallLogic, resolveColumnCount } from '@xui-design/shared';
import type { WaterfallProps } from '@xui-design/core';

// Omit 剔除回调 prop，避免被 Vue defineProps 编译进 props 选项
const props = withDefaults(
  defineProps<
    Omit<WaterfallProps, 'onItemClick' | 'onLayoutChange' | 'onLoadMore' | 'renderItem'> & {
      /** renderItem 不适用于 Vue；Vue 端用 #item 作用域 slot */
      renderItem?: never;
    }
  >(),
  {
    columns: 4,
    gutter: 16,
    loadMoreThreshold: 200,
  },
);

const emit = defineEmits<{
  itemClick: [item: Record<string, unknown>, index: number];
  layoutChange: [payload: { columnCount: number; columnHeights: number[] }];
  loadMore: [];
}>();

// ---- DOM refs ----
const containerRef = ref<HTMLElement | null>(null);
/** 条目 key → DOM 元素（用于 ResizeObserver 测量） */
const itemRefs = new Map<string, HTMLElement>();

// ---- 逻辑层 ----
const logic = createWaterfallLogic({
  items: props.items,
  rowKey: props.rowKey,
  columns: props.columns,
  gutter: props.gutter,
  onItemClick: (item, index) => emit('itemClick', item, index),
  onLayoutChange: (payload) => emit('layoutChange', payload),
});

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(unsubscribe);

// Props 变化同步到逻辑层
watchEffect(() => {
  logic.updateOptions({
    items: props.items,
    rowKey: props.rowKey,
    columns: props.columns,
    gutter: props.gutter,
  });
});

// ---- 工具函数：生成条唯一键（与逻辑层保持一致） ----
function getKey(item: Record<string, unknown>, index: number): string {
  if (props.rowKey && item[props.rowKey] !== undefined && item[props.rowKey] !== null) {
    return String(item[props.rowKey]);
  }
  return String(index);
}

// 计算 item 的 key → index 映射（handleItemClick 反查用）
const keyToIndex = computed(() => {
  const map = new Map<string, number>();
  if (!props.items) return map;
  for (let i = 0; i < props.items.length; i++) {
    map.set(getKey(props.items[i], i), i);
  }
  return map;
});

// ---- ResizeObserver 链路 ----
let frame: number | null = null;
let containerObserver: ResizeObserver | undefined;
let itemObserver: ResizeObserver | undefined;
/** 上次调度是否为首次挂载测量（用于跳过无意义的 setColumnCount 同步） */
let firstMeasure = true;

/** rAF 合并的调度函数：一帧内所有 ResizeObserver 回调都合到一起执行 */
function scheduleRaf() {
  if (frame !== null) return;
  frame = requestAnimationFrame(() => {
    frame = null;
    doMeasureAndLayout();
  });
}

/** 一帧内统一执行：测量容器 → 更新列数 → 测量所有 item 高度 */
function doMeasureAndLayout() {
  const el = containerRef.value;
  if (!el) return;

  // 1) 容器宽度 → 响应式列数切换
  if (props.breakpoints && !firstMeasure) {
    const width = el.clientWidth;
    const fallback = props.columns ?? 4;
    const newCount = resolveColumnCount(width, props.breakpoints, fallback);
    logic.setColumnCount(newCount);
  }
  firstMeasure = false;

  // 2) 重新测量所有已注册的 item 高度
  for (const [key, itemEl] of itemRefs) {
    const h = itemEl.getBoundingClientRect().height;
    logic.updateItemHeight(key, h);
  }
}

// 全局 item ResizeObserver（幂等 observe：重复 observe 同一元素不会加新订阅）
function ensureItemObserver(): ResizeObserver | undefined {
  if (itemObserver) return itemObserver;
  if (typeof ResizeObserver === 'undefined') return undefined;
  itemObserver = new ResizeObserver(() => scheduleRaf());
  return itemObserver;
}

/**
 * 生成某个 item 的 ref 回调工厂
 *
 * Vue 模板里不能显式给箭头参数加类型（vue-tsc 严格模式会报 TS7006 隐式 any），
 * 所以把 ref 回调定义在 script setup 里并显式标注参数类型，模板里用 :ref="getItemRef(key)" 调用。
 */
function getItemRef(key: string): VNodeRef {
  return (el) => {
    const obs = ensureItemObserver();
    if (el instanceof HTMLElement) {
      itemRefs.set(key, el);
      obs?.observe(el);
    } else {
      // el 为 null：模板元素卸载时清理
      const prev = itemRefs.get(key);
      if (prev) obs?.unobserve(prev);
      itemRefs.delete(key);
    }
  };
}

// 条目点击
function handleItemClick(key: string) {
  const idx = keyToIndex.value.get(key);
  if (idx === undefined || !props.items) return;
  logic.handleItemClick(props.items[idx], idx);
}

// 辅助：通过 key 反查 item 对象和 index（给 slot 传 scoped params）
function getItemByKey(key: string): Record<string, unknown> | undefined {
  const idx = keyToIndex.value.get(key);
  return idx !== undefined ? props.items?.[idx] : undefined;
}
function getIndexByKey(key: string): number {
  return keyToIndex.value.get(key) ?? -1;
}

// ---- 无限滚动 ----
let scrollHandler: (() => void) | undefined;

function handleScroll() {
  const el = containerRef.value;
  if (!el) return;
  // 无 height / 加载中 / 已全部加载 → 跳过
  if (!props.height || props.loading || props.finished) return;

  const { scrollTop, scrollHeight, clientHeight } = el;
  const threshold = props.loadMoreThreshold ?? 200;
  if (scrollHeight - scrollTop - clientHeight < threshold) {
    emit('loadMore');
  }
}

onMounted(() => {
  const el = containerRef.value;
  if (!el) return;

  // height 存在 → 容器变可滚动，监听 scroll
  if (props.height) {
    scrollHandler = () => handleScroll();
    el.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // jsdom / 旧环境无 ResizeObserver：只做首次测量
  if (typeof ResizeObserver === 'undefined') {
    nextTick(() => {
      for (const [key, itemEl] of itemRefs) {
        logic.updateItemHeight(key, itemEl.getBoundingClientRect().height);
      }
    });
    return;
  }

  // 首次挂载：nextTick 等 DOM 渲染完再测量
  nextTick(() => scheduleRaf());

  // 监听容器宽度变化
  containerObserver = new ResizeObserver(() => scheduleRaf());
  containerObserver.observe(el);
});

onUnmounted(() => {
  const el = containerRef.value;
  if (el && scrollHandler) {
    el.removeEventListener('scroll', scrollHandler);
    scrollHandler = undefined;
  }
  containerObserver?.disconnect();
  itemObserver?.disconnect();
  itemRefs.clear();
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
});

// 暴露逻辑实例给父组件（命令式 API 预留）
// defineExpose({ /* ... */ });
</script>

<template>
  <div
    ref="containerRef"
    class="xui-waterfall"
    :class="{
      'xui-waterfall--empty': state.columns.flat().length === 0,
      'xui-waterfall--scrollable': !!height,
    }"
    :style="{
      '--xui-waterfall-gutter': `${gutter}px`,
      ...(height !== undefined
        ? { height: typeof height === 'number' ? `${height}px` : height }
        : {}),
    }"
  >
    <!-- 多列 flex 布局：每列 flex:1，flex-direction:column -->
    <template v-if="state.columns.flat().length > 0">
      <div v-for="(col, colIdx) in state.columns" :key="colIdx" class="xui-waterfall__column">
        <div
          v-for="key in col"
          :key="key"
          :ref="getItemRef(key)"
          class="xui-waterfall__item"
          @click="handleItemClick(key)"
        >
          <!-- 优先消费 item slot（带作用域参数 item + index） -->
          <slot
            v-if="$slots.item"
            name="item"
            :item="getItemByKey(key)"
            :index="getIndexByKey(key)"
          />
          <div v-else class="xui-waterfall__item-placeholder" />
        </div>
      </div>
    </template>

    <!-- 空态 -->
    <slot name="empty" v-else />
  </div>
</template>
