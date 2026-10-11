<script setup lang="ts">
import { Avatar } from '@xui/vue';
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Avatar shape="square">方</Avatar>
      <Avatar shape="circle">圆</Avatar>
    </div>
    <div class="demo-row">
      <Avatar src="/not-exist.png" @error="() => console.log('image load failed')">失败回退</Avatar>
      <Avatar src="/not-exist.png" />
    </div>
  </div>
</template>
