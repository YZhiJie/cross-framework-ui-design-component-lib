<script setup lang="ts">
import { ref } from 'vue';
import { getTheme, setTheme, toggleTheme } from '@xui-design/vue';
import { Alert, Button, Input, Switch, Tag } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const current = ref(getTheme());
const enabled = ref(true);
const text = ref('');

const updateText = () => {
  text.value = isZh() ? '跟随主题的输入框' : 'Themed input';
};
updateText();

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
      <Button type="primary" @click="apply('dark')">
        {{ isZh() ? '切换为暗色' : 'Switch to Dark' }}
      </Button>
      <Button @click="apply('light')">
        {{ isZh() ? '切换为浅色' : 'Switch to Light' }}
      </Button>
      <Button type="link" @click="toggle">
        {{ isZh() ? '往返切换' : 'Toggle' }}
      </Button>
      <Tag :type="current === 'dark' ? 'warning' : 'primary'">
        {{ isZh() ? '当前' : 'Current' }}：{{ current === 'dark' ? 'dark' : 'light' }}
      </Tag>
    </div>
    <Alert
      type="info"
      :title="isZh() ? '全局主题' : 'Global Theme'"
      :description="
        isZh()
          ? 'Alert / Button / Input / Switch 等组件颜色全部随主题联动。'
          : 'Alert / Button / Input / Switch colors all follow the theme.'
      "
    />
    <div class="demo-row">
      <Input v-model:value="text" style="width: 220px" />
      <Switch v-model:value="enabled" />
    </div>
  </div>
</template>
