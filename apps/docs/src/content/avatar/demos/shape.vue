<script setup lang="ts">
import { Avatar } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Avatar shape="square">{{ isZh() ? '方' : 'Square' }}</Avatar>
      <Avatar shape="circle">{{ isZh() ? '圆' : 'Circle' }}</Avatar>
    </div>
    <div class="demo-row">
      <Avatar src="/not-exist.png" @error="() => console.log('image load failed')">
        {{ isZh() ? '失败回退' : 'Fallback' }}
      </Avatar>
      <Avatar src="/not-exist.png" />
    </div>
  </div>
</template>
