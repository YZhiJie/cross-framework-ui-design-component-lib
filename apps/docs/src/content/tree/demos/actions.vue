<script setup lang="ts">
import { ref } from 'vue';
import { Button, Tree } from '@xui-design/vue';
import type { TreeNode, TreeRef } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const treeRef = ref<TreeRef | null>(null);
const checkedKeys = ref<string[]>([]);

const data: TreeNode[] = [
  {
    key: 'frontend',
    label: '前端',
    children: [
      { key: 'vue', label: 'Vue' },
      { key: 'react', label: 'React' },
    ],
  },
  {
    key: 'backend',
    label: '后端',
    children: [
      { key: 'node', label: 'Node.js' },
      { key: 'go', label: 'Go' },
    ],
  },
];
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button size="sm" @click="treeRef?.expandAll()">{{
        isZh() ? '全部展开' : 'Expand all'
      }}</Button>
      <Button size="sm" @click="treeRef?.collapseAll()">
        {{ isZh() ? '全部收起' : 'Collapse all' }}
      </Button>
      <Button size="sm" @click="treeRef?.checkAll()">{{ isZh() ? '全选' : 'Check all' }}</Button>
      <Button size="sm" @click="treeRef?.uncheckAll()">
        {{ isZh() ? '清空勾选' : 'Uncheck all' }}
      </Button>
    </div>
    <Tree
      ref="treeRef"
      v-model:checked-keys="checkedKeys"
      :data="data"
      checkable
      default-expand-all
    />
  </div>
</template>
