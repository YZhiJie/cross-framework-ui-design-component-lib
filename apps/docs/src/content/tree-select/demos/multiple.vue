<script setup lang="ts">
import { ref } from 'vue';
import { TreeSelect } from '@xui-design/vue';
import type { TreeNode } from '@xui-design/core';
import { isZh } from '../../../i18n';

const treeData: TreeNode[] = [
  {
    key: 'frontend',
    label: isZh() ? '前端' : 'Frontend',
    children: [
      { key: 'vue', label: 'Vue' },
      { key: 'react', label: 'React' },
    ],
  },
  {
    key: 'backend',
    label: isZh() ? '后端' : 'Backend',
    children: [{ key: 'node', label: 'Node.js' }],
  },
];

const result = ref(isZh() ? '（等待选择）' : '(pending)');

function handleChange(value: string | string[]) {
  result.value = isZh() ? `已勾选：${(value as string[]).join(', ') || '无'}` : `Checked: ${(value as string[]).join(', ') || 'none'}`;
}
</script>

<template>
  <div class="demo-column">
    <TreeSelect
      :tree-data="treeData"
      multiple
      default-expand-all
      clearable
      style="max-width: 280px"
      @change="handleChange"
    />
    <p class="demo-text">{{ result }}</p>
  </div>
</template>
