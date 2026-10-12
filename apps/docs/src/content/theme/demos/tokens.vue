<script setup lang="ts">
import { Button, clearThemeTokens, setThemeTokens, Switch, Tag } from '@xui/vue';
import { ref } from 'vue';

const enabled = ref(true);

/** 品牌色预设：仅覆盖主色三态，其余 token 保持默认 */
const presets: Record<string, Record<string, string>> = {
  emerald: {
    '--xui-color-primary': '#10b981',
    '--xui-color-primary-hover': '#059669',
    '--xui-color-primary-active': '#047857',
  },
  amber: {
    '--xui-color-primary': '#f59e0b',
    '--xui-color-primary-hover': '#d97706',
    '--xui-color-primary-active': '#b45309',
  },
  rose: {
    '--xui-color-primary': '#f43f5e',
    '--xui-color-primary-hover': '#e11d48',
    '--xui-color-primary-active': '#be123c',
  },
};

const apply = (name: string) => setThemeTokens(presets[name]);
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button @click="apply('emerald')">翡翠绿</Button>
      <Button @click="apply('amber')">琥珀橙</Button>
      <Button @click="apply('rose')">玫红</Button>
      <Button type="link" @click="clearThemeTokens()">恢复默认品牌色</Button>
    </div>
    <div class="demo-row">
      <Button type="primary">主色按钮</Button>
      <Tag type="primary">主色标签</Tag>
      <Switch v-model:value="enabled" />
    </div>
  </div>
</template>
