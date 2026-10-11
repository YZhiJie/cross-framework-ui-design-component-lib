<script setup lang="ts">
import { Button, message } from '@xui/vue';
</script>

<template>
  <div class="demo-row">
    <Button @click="message.info('这是一条普通提示')">Info</Button>
    <Button type="primary" @click="message.success('保存成功')">Success</Button>
    <Button @click="message.warning('磁盘空间不足')">Warning</Button>
    <Button @click="message.error('保存失败，请重试')">Error</Button>
  </div>
</template>
