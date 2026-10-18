<script setup lang="ts">
import { ref } from 'vue';
import { TreeSelect } from '@xui-design/vue';
import type { TreeNode } from '@xui-design/core';
import { isZh } from '../../../i18n';

const treeData: TreeNode[] = [
  {
    key: 'zj',
    label: isZh() ? '浙江' : 'Zhejiang',
    children: [
      { key: 'hz', label: isZh() ? '杭州' : 'Hangzhou' },
      {
        key: 'nb',
        label: isZh() ? '宁波' : 'Ningbo',
        children: [{ key: 'yh', label: isZh() ? '余杭' : 'Yuhang' }],
      },
    ],
  },
  { key: 'js', label: isZh() ? '江苏' : 'Jiangsu' },
  { key: 'gd', label: isZh() ? '广东' : 'Guangdong', disabled: true },
];

const result = ref(isZh() ? '（等待选择）' : '(pending)');

function handleChange(value: string | string[]) {
  result.value = isZh() ? `已选择：${String(value)}` : `Selected: ${String(value)}`;
}
</script>

<template>
  <div class="demo-column">
    <TreeSelect
      :tree-data="treeData"
      default-expand-all
      clearable
      style="max-width: 280px"
      @change="handleChange"
    />
    <p class="demo-text">{{ result }}</p>
  </div>
</template>
