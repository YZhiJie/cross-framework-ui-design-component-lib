<script setup lang="ts">
import { ref } from 'vue';
import { getTheme, setTheme, toggleTheme } from '@xui-design/vue';
import { Alert, Button, Input, Switch, Tag } from '@xui-design/vue';

const current = ref(getTheme());
const enabled = ref(true);
const text = ref('跟随主题的输入框');

const apply = (theme: 'light' | 'dark') => {
  setTheme(theme);
  current.value = getTheme();
};

const toggle = () => {
  current.value = toggleTheme();
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" @click="apply('dark')">切换为暗色</Button>
      <Button @click="apply('light')">切换为浅色</Button>
      <Button type="link" @click="toggle">往返切换</Button>
      <Tag :type="current === 'dark' ? 'warning' : 'primary'">
        当前：{{ current === 'dark' ? 'dark' : 'light' }}
      </Tag>
    </div>
    <Alert
      type="info"
      title="全局主题"
      description="Alert / Button / Input / Switch 等组件颜色全部随主题联动。"
    />
    <div class="demo-row">
      <Input v-model:value="text" style="width: 220px" />
      <Switch v-model:value="enabled" />
    </div>
  </div>
</template>
