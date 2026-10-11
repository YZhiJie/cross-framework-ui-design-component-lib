<script setup lang="ts">
import { Popconfirm, Button } from '@xui/vue';
</script>

<template>
  <div class="demo-row">
    <Popconfirm
      content="右侧弹出的气泡确认"
      placement="right"
      confirm-text="好的"
      cancel-text="再想想"
    >
      <Button>右侧 + 自定义按钮</Button>
    </Popconfirm>
    <Popconfirm content="禁用后点击无效" disabled>
      <Button>禁用</Button>
    </Popconfirm>
  </div>
</template>
