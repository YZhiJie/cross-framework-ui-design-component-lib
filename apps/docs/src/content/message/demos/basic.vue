<script setup lang="ts">
import { Button, message } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-row">
    <Button @click="message.info(isZh() ? '这是一条普通提示' : 'A normal info message.')"
      >Info</Button
    >
    <Button type="primary" @click="message.success(isZh() ? '保存成功' : 'Saved successfully')">
      Success
    </Button>
    <Button @click="message.warning(isZh() ? '磁盘空间不足' : 'Insufficient disk space')">
      Warning
    </Button>
    <Button @click="message.error(isZh() ? '保存失败，请重试' : 'Save failed, please retry')">
      Error
    </Button>
  </div>
</template>
