<script setup lang="ts">
import { Button, message } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const openPersistent = () => {
  message.open({
    content: isZh()
      ? '这条消息不会自动关闭，可手动关闭'
      : 'This message will not auto-close, close it manually',
    duration: 0,
    closable: true,
  });
};
</script>

<template>
  <div class="demo-row">
    <Button type="primary" @click="openPersistent">
      {{ isZh() ? '不自动关闭' : 'No auto-close' }}
    </Button>
    <Button @click="message.closeAll()">{{ isZh() ? '关闭全部' : 'Close all' }}</Button>
  </div>
</template>
