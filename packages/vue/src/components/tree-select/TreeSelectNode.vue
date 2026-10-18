<script setup lang="ts">
// TreeSelect 递归树节点（由 TreeSelect.vue 内部使用，不对外导出）
import { computed } from 'vue';
import { icons } from '@xui-design/icons';
import type { TreeSelectLogicInstance, TreeSelectState } from '@xui-design/shared';
import type { TreeNode } from '@xui-design/core';

const props = defineProps<{
  node: TreeNode;
  logic: TreeSelectLogicInstance;
  state: TreeSelectState;
  multiple: boolean;
  depth: number;
}>();

const isLeaf = computed(() => !props.node.children || props.node.children.length === 0);
const expanded = computed(() => props.state.expandedKeys.includes(props.node.key));
const selected = computed(() => props.state.selectedKey === props.node.key);

// 勾选态经 logic.getCheckState 推导；显式引用 checkedKeys 让 computed 收集依赖
const checkState = computed(() => {
  void props.state.checkedKeys;
  return props.logic.getCheckState(props.node.key);
});

const checkboxDisabled = computed(
  () => props.state.disabled || props.node.disabled || props.node.disableCheckbox,
);

const handleSwitcherClick = () => {
  if (!isLeaf.value) props.logic.toggleExpand(props.node.key);
};

const handleCheckboxClick = () => {
  if (!checkboxDisabled.value) props.logic.toggleCheck(props.node.key);
};

const handleTitleClick = () => {
  if (props.multiple) {
    if (!checkboxDisabled.value) props.logic.toggleCheck(props.node.key);
    return;
  }
  props.logic.selectNode(props.node.key);
};
</script>

<template>
  <li
    class="xui-tree-select__node"
    :class="{
      'is-expanded': expanded,
      'is-selected': !multiple && selected,
      'is-disabled': node.disabled,
      'is-leaf': isLeaf,
    }"
    role="treeitem"
    :aria-expanded="isLeaf ? undefined : expanded"
    :aria-selected="!multiple ? selected : undefined"
    :aria-disabled="node.disabled || undefined"
  >
    <div class="xui-tree-select__node-content" :style="{ paddingLeft: `${depth * 16}px` }">
      <span
        class="xui-tree-select__switcher"
        :class="{ 'is-leaf': isLeaf, 'is-expanded': expanded }"
        aria-hidden="true"
        @click.stop="handleSwitcherClick"
      >
        <svg
          v-if="!isLeaf"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-html="icons['arrow-right']"
        />
      </span>
      <span
        v-if="multiple"
        class="xui-tree-select__checkbox"
        :class="{ 'is-disabled': checkboxDisabled }"
        role="checkbox"
        :aria-checked="checkState.indeterminate ? 'mixed' : checkState.checked"
        :aria-disabled="checkboxDisabled || undefined"
        @click.stop="handleCheckboxClick"
      >
        <span
          class="xui-tree-select__checkbox-inner"
          :class="{
            'is-checked': checkState.checked,
            'is-indeterminate': checkState.indeterminate,
          }"
        />
      </span>
      <span class="xui-tree-select__title" @click="handleTitleClick">{{ node.label }}</span>
    </div>
    <ul v-if="!isLeaf && expanded" class="xui-tree-select__children" role="group">
      <TreeSelectNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :logic="logic"
        :state="state"
        :multiple="multiple"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>
