<script setup lang="ts">
import { Button, message } from '@xui-design/vue';

const openPersistent = () => {
  message.open({
    content: '这条消息不会自动关闭，可手动关闭',
    duration: 0,
    closable: true,
  });
};
</script>

<template>
  <div class="demo-row">
    <Button type="primary" @click="openPersistent">不自动关闭</Button>
    <Button @click="message.closeAll()">关闭全部</Button>
  </div>
</template>
