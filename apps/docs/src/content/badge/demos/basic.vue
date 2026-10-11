<script setup lang="ts">
import { ref } from 'vue';
import { Badge, Button } from '@xui/vue';

const count = ref(5);
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Badge :count="count">
        <Button>消息</Button>
      </Badge>
      <Badge :count="120" :max="99">
        <Button>通知</Button>
      </Badge>
    </div>
    <div class="demo-row">
      <Button size="sm" @click="count = Math.max(0, count - 1)">-1</Button>
      <Button size="sm" type="primary" @click="count++">+1（试试超过 99）</Button>
    </div>
  </div>
</template>
