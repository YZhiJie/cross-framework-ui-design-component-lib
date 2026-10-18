<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, useTemplateRef, watchEffect } from 'vue';
import { createTreeSelectLogic, flattenTree } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLocaleData } from '../../hooks/use-locale';
import type { TreeSelectProps } from '@xui-design/core';
import TreeSelectNode from './TreeSelectNode.vue';

const props = withDefaults(defineProps<Omit<TreeSelectProps, 'onChange' | 'onClear'>>(), {
  value: undefined,
  defaultValue: undefined,
  multiple: false,
  checkStrictly: false,
  placeholder: undefined,
  disabled: false,
  clearable: false,
  defaultExpandAll: false,
});

const emit = defineEmits<{
  change: [value: string | string[]];
  clear: [];
  'update:value': [value: string | string[]];
}>();

const rootRef = useTemplateRef<HTMLElement>('root');
const triggerRef = useTemplateRef<HTMLElement>('trigger');
const triggerId = useId();
const panelId = useId();

const { value, defaultValue, disabled } = props;

const logic = createTreeSelectLogic({
  value,
  defaultValue,
  treeData: props.treeData,
  multiple: props.multiple,
  checkStrictly: props.checkStrictly,
  defaultExpandAll: props.defaultExpandAll,
  disabled,
  onChange: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
  onClear: () => emit('clear'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

const handleOutside = (event: MouseEvent) => {
  if (state.value.open && rootRef.value && !rootRef.value.contains(event.target as Node)) {
    logic.close();
  }
};

const handleDocKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && state.value.open) logic.close();
};

onMounted(() => {
  document.addEventListener('mousedown', handleOutside);
  document.addEventListener('keydown', handleDocKeydown);
});

onUnmounted(() => {
  unsubscribe();
  document.removeEventListener('mousedown', handleOutside);
  document.removeEventListener('keydown', handleDocKeydown);
});

// Props 变更同步到逻辑层（withDefaults 返回值不可解构，模板/逻辑一律 props.xxx）
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    treeData: props.treeData,
    checkStrictly: props.checkStrictly,
    disabled: props.disabled,
  });
});

// 单选：选中节点展示文案
const displayLabel = computed(() => {
  if (props.multiple || typeof state.value.value !== 'string') return null;
  return flattenTree(props.treeData).keyMap.get(state.value.value)?.node.label ?? null;
});

// 多选：已勾选的标签列表（checkedKeys 逐项映射 label）
const checkedTags = computed(() => {
  if (!props.multiple || !Array.isArray(state.value.value)) return [];
  const { keyMap } = flattenTree(props.treeData);
  return state.value.value
    .map((key) => {
      const entry = keyMap.get(key);
      return entry ? { key, label: entry.node.label } : null;
    })
    .filter(Boolean) as { key: string; label: string }[];
});

// 是否有选中值（控制清空按钮显示）
const hasValue = computed(() =>
  props.multiple ? checkedTags.value.length > 0 : !!state.value.value,
);

const locale = useLocaleData();

const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      logic.toggleOpen();
      break;
    case 'Escape':
      if (state.value.open) {
        event.preventDefault();
        logic.close();
      }
      break;
  }
};

const focus = () => {
  triggerRef.value?.focus();
};

const toggleOpen = () => {
  logic.toggleOpen();
};

const close = () => {
  logic.close();
};

defineExpose({ focus, toggleOpen, close });
</script>

<template>
  <div
    ref="root"
    class="xui-tree-select"
    :class="[
      className,
      { 'is-disabled': state.disabled, 'is-open': state.open, 'is-multiple': props.multiple },
    ]"
    :style="style"
  >
    <div
      ref="trigger"
      :id="triggerId"
      class="xui-tree-select__trigger"
      role="combobox"
      :aria-expanded="state.open"
      aria-haspopup="dialog"
      :aria-controls="state.open ? panelId : undefined"
      :aria-disabled="state.disabled || undefined"
      :tabindex="state.disabled ? -1 : 0"
      @click="logic.toggleOpen()"
      @keydown="handleTriggerKeydown"
    >
      <!-- 多选标签 -->
      <template v-if="props.multiple">
        <span v-if="checkedTags.length === 0" class="xui-tree-select__placeholder">
          {{ props.placeholder ?? locale.treeSelect.placeholder }}
        </span>
        <span v-else class="xui-tree-select__tags">
          <span v-for="tag in checkedTags" :key="tag.key" class="xui-tree-select__tag">
            <span class="xui-tree-select__tag-label">{{ tag.label }}</span>
            <span
              class="xui-tree-select__tag-close"
              role="button"
              aria-label="remove"
              @click.stop="logic.toggleCheck(tag.key)"
              >×</span
            >
          </span>
        </span>
      </template>
      <!-- 单选展示 -->
      <template v-else>
        <span v-if="displayLabel" class="xui-tree-select__value">{{ displayLabel }}</span>
        <span v-else class="xui-tree-select__placeholder">
          {{ props.placeholder ?? locale.treeSelect.placeholder }}
        </span>
      </template>

      <span
        v-if="props.clearable && hasValue && !state.disabled"
        class="xui-tree-select__clear"
        role="button"
        aria-label="clear"
        @click.stop="logic.clear()"
      >
        <slot name="clearIcon">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
            v-html="icons.clear"
          />
        </slot>
      </span>
      <span
        v-else
        class="xui-tree-select__arrow"
        :class="{ 'is-open': state.open }"
        aria-hidden="true"
      >
        <slot name="suffixIcon">
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
            v-html="icons['arrow-down']"
          />
        </slot>
      </span>
    </div>
    <div
      v-if="state.open"
      :id="panelId"
      class="xui-tree-select__panel"
      role="dialog"
      :aria-label="locale.treeSelect.panel"
      @click.stop
    >
      <ul class="xui-tree-select__list" role="tree" :aria-label="locale.treeSelect.panel">
        <TreeSelectNode
          v-for="node in props.treeData"
          :key="node.key"
          :node="node"
          :logic="logic"
          :state="state"
          :multiple="props.multiple"
          :depth="0"
        />
      </ul>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
