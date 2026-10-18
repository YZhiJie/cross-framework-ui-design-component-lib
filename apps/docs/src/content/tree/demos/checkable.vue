<script setup lang="ts">
import { ref } from 'vue';
import { Tree } from '@xui-design/vue';
import type { TreeNode } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const checkedKeys = ref<string[]>([]);

const data: TreeNode[] = [
  {
    key: 'fruit',
    label: isZh() ? '水果' : 'Fruits',
    children: [
      { key: 'apple', label: isZh() ? '苹果' : 'Apple' },
      { key: 'banana', label: isZh() ? '香蕉' : 'Banana' },
      { key: 'durian', label: isZh() ? '榴莲（缺货）' : 'Durian (sold out)', disabled: true },
    ],
  },
  {
    key: 'veggie',
    label: isZh() ? '蔬菜' : 'Vegetables',
    children: [
      { key: 'carrot', label: isZh() ? '胡萝卜' : 'Carrot' },
      { key: 'tomato', label: isZh() ? '番茄' : 'Tomato' },
    ],
  },
];
</script>

<template>
  <div class="demo-column">
    <Tree v-model:checked-keys="checkedKeys" :data="data" checkable default-expand-all />
    <p class="demo-text">
      {{
        isZh()
          ? `已勾选：${checkedKeys.length ? checkedKeys.join(', ') : '（无）'}`
          : `Checked: ${checkedKeys.length ? checkedKeys.join(', ') : '(none)'}`
      }}
    </p>
  </div>
</template>
