<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { createTreeLogic } from '@xui-design/shared';
import type { TreeNode } from '@xui-design/shared';
import type { TreeProps } from '@xui-design/core';
import TreeNodeItem from './TreeNode.vue';

const props = withDefaults(defineProps<Omit<TreeProps, 'onExpand' | 'onCheck' | 'onSelect'>>(), {
  expandedKeys: undefined,
  defaultExpandedKeys: undefined,
  checkedKeys: undefined,
  defaultCheckedKeys: undefined,
  selectedKey: undefined,
  defaultSelectedKey: undefined,
  checkable: false,
  checkStrictly: false,
  defaultExpandAll: false,
  disabled: false,
});

const emit = defineEmits<{
  expand: [expandedKeys: string[], info: { key: string; expanded: boolean }];
  check: [checkedKeys: string[], info: { key: string; checked: boolean }];
  select: [selectedKey: string | null, info: { key: string }];
  'update:expandedKeys': [expandedKeys: string[]];
  'update:checkedKeys': [checkedKeys: string[]];
  'update:selectedKey': [selectedKey: string | null];
}>();

const logic = createTreeLogic({
  data: props.data,
  expandedKeys: props.expandedKeys,
  defaultExpandedKeys: props.defaultExpandedKeys,
  checkedKeys: props.checkedKeys,
  defaultCheckedKeys: props.defaultCheckedKeys,
  selectedKey: props.selectedKey,
  defaultSelectedKey: props.defaultSelectedKey,
  checkable: props.checkable,
  checkStrictly: props.checkStrictly,
  defaultExpandAll: props.defaultExpandAll,
  disabled: props.disabled,
  onExpand: (keys, info) => {
    emit('update:expandedKeys', keys);
    emit('expand', keys, info);
  },
  onCheck: (keys, info) => {
    emit('update:checkedKeys', keys);
    emit('check', keys, info);
  },
  onSelect: (key, info) => {
    emit('update:selectedKey', key);
    emit('select', key, info);
  },
});

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(unsubscribe);

// Props 变更同步到逻辑层（withDefaults 返回值不可解构，模板/逻辑一律 props.xxx）
watchEffect(() => {
  logic.updateOptions({
    data: props.data,
    expandedKeys: props.expandedKeys,
    checkedKeys: props.checkedKeys,
    selectedKey: props.selectedKey,
    checkable: props.checkable,
    checkStrictly: props.checkStrictly,
    disabled: props.disabled,
  });
});

const expandAll = () => logic.expandAll();
const collapseAll = () => logic.collapseAll();
const checkAll = () => logic.checkAll();
const uncheckAll = () => logic.uncheckAll();

defineExpose({ expandAll, collapseAll, checkAll, uncheckAll });
</script>

<template>
  <div
    class="xui-tree"
    :class="[className, { 'is-disabled': state.disabled }]"
    :style="style"
    role="tree"
  >
    <ul class="xui-tree__list">
      <TreeNodeItem
        v-for="node in props.data"
        :key="node.key"
        :node="node"
        :logic="logic"
        :state="state"
        :checkable="props.checkable"
        :depth="0"
      >
        <template v-if="$slots.title" #title="slotProps: { node: TreeNode }">
          <slot name="title" v-bind="slotProps" />
        </template>
      </TreeNodeItem>
    </ul>
  </div>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
