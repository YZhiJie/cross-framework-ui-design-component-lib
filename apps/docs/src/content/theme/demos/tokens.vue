<script setup lang="ts">
import { Button, clearThemeTokens, setThemeTokens, Switch, Tag } from '@xui-design/vue';
import { ref } from 'vue';
import { isZh } from '../../../i18n';

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
      <Button @click="apply('emerald')">{{ isZh() ? '翡翠绿' : 'Emerald' }}</Button>
      <Button @click="apply('amber')">{{ isZh() ? '琥珀橙' : 'Amber' }}</Button>
      <Button @click="apply('rose')">{{ isZh() ? '玫红' : 'Rose' }}</Button>
      <Button type="link" @click="clearThemeTokens()">
        {{ isZh() ? '恢复默认品牌色' : 'Reset to default brand color' }}
      </Button>
    </div>
    <div class="demo-row">
      <Button type="primary">{{ isZh() ? '主色按钮' : 'Primary button' }}</Button>
      <Tag type="primary">{{ isZh() ? '主色标签' : 'Primary tag' }}</Tag>
      <Switch v-model:value="enabled" />
    </div>
  </div>
</template>
