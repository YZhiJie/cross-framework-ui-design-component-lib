<script setup lang="ts">
import { ref } from 'vue';
import { Tree } from '@xui-design/vue';
import type { TreeNode } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const selectedKey = ref<string | null>(null);

const data: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'button', label: 'Button.vue' },
          { key: 'input', label: 'Input.vue' },
        ],
      },
      { key: 'main', label: 'main.ts' },
    ],
  },
  { key: 'readme', label: 'README.md' },
];
</script>

<template>
  <div class="demo-column">
    <Tree v-model:selected-key="selectedKey" :data="data" default-expand-all />
    <p class="demo-text">
      {{
        isZh() ? `选中节点：${selectedKey ?? '（未选中）'}` : `Selected: ${selectedKey ?? '(none)'}`
      }}
    </p>
  </div>
</template>
