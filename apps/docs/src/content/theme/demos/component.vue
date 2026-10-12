<script setup lang="ts">
import { Button, Switch } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <p class="demo-text">
      {{
        isZh()
          ? '在组件 style 上写 CSS 变量即可覆盖主题，仅作用于该组件子树：'
          : 'Write CSS variables in the component style to override the theme, scoped to that component subtree only:'
      }}
    </p>
    <div
      class="demo-row"
      style="
        --xui-color-primary: #7c3aed;
        --xui-color-primary-hover: #6d28d9;
        --xui-color-primary-active: #5b21b6;
      "
    >
      <Button type="primary">{{ isZh() ? '紫色子树' : 'Purple subtree' }}</Button>
      <Switch :value="true" />
    </div>
    <div class="demo-row" style="--xui-color-danger: #0ea5e9">
      <Button type="danger">{{
        isZh() ? 'danger 覆盖为天蓝' : 'danger overridden to sky blue'
      }}</Button>
      <Button type="primary">{{ isZh() ? '不受影响' : 'Unaffected' }}</Button>
    </div>
  </div>
</template>
