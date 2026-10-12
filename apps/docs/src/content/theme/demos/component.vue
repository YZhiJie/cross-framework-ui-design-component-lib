<script setup lang="ts">
import { Button, Switch } from '@xui/vue';
</script>

<template>
  <div class="demo-column">
    <p class="demo-text">在组件 style 上写 CSS 变量即可覆盖主题，仅作用于该组件子树：</p>
    <div class="demo-row" style="--xui-color-primary: #7c3aed; --xui-color-primary-hover: #6d28d9; --xui-color-primary-active: #5b21b6">
      <Button type="primary">紫色子树</Button>
      <Switch :value="true" />
    </div>
    <div class="demo-row" style="--xui-color-danger: #0ea5e9">
      <Button type="danger">danger 覆盖为天蓝</Button>
      <Button type="primary">不受影响</Button>
    </div>
  </div>
</template>
