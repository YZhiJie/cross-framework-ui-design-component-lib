<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useId, useTemplateRef, watchEffect } from 'vue';
import { createTabsLogic } from '@xui-design/shared';
import type { TabsProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<TabsProps, 'onChange'>>(), {
  // 显式 undefined 默认值：未绑定 value 时保持 undefined → 逻辑层进入非受控模式
  value: undefined,
  defaultValue: undefined,
});

const emit = defineEmits<{
  change: [value: string];
  'update:value': [value: string];
}>();

const rootRef = useTemplateRef<HTMLElement>('root');
const tabsId = useId();

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { value, defaultValue, items } = props;

const logic = createTabsLogic({
  value,
  defaultValue,
  items,
  onChange: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

// Props 变更同步到逻辑层（受控模式：value 变更 → 逻辑层）
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    items: props.items,
  });
});

const activeItem = computed(() => props.items?.find((item) => item.value === state.value.value));

const handleTabClick = (val: string) => {
  logic.activate(val);
};

// 属性选择器转义：不依赖 CSS.escape 全局（jsdom 可能缺失），仅处理引号
const queryTab = (value: string) =>
  rootRef.value?.querySelector<HTMLButtonElement>(`[data-value="${value.replace(/"/g, '\\"')}"]`);

// 键盘左右箭头切换（跳过禁用项），焦点跟随到新激活 tab（roving tabindex）
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  event.preventDefault();
  logic.moveActive(event.key === 'ArrowRight' ? 1 : -1);
  nextTick(() => {
    const active = state.value.value;
    if (active !== null) {
      queryTab(active)?.focus();
    }
  });
};
</script>

<template>
  <div ref="root" class="xui-tabs" :class="className" :style="style">
    <div class="xui-tabs__list" role="tablist" @keydown="handleKeydown">
      <button
        v-for="item in props.items"
        :id="`${tabsId}-tab-${item.value}`"
        :key="item.value"
        type="button"
        class="xui-tabs__tab"
        :class="{ 'is-active': item.value === state.value, 'is-disabled': item.disabled }"
        role="tab"
        :aria-selected="item.value === state.value"
        :aria-disabled="item.disabled || undefined"
        :aria-controls="`${tabsId}-panel-${item.value}`"
        :tabindex="item.value === state.value ? 0 : -1"
        :data-value="item.value"
        @click="handleTabClick(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-if="activeItem"
      :id="`${tabsId}-panel-${activeItem.value}`"
      class="xui-tabs__panel"
      role="tabpanel"
      :aria-labelledby="`${tabsId}-tab-${activeItem.value}`"
    >
      <!-- 作用域插槽：参数为当前激活项；无插槽内容时回退显示标签文案 -->
      <slot :item="activeItem">{{ activeItem.label }}</slot>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
