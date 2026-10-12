<script setup lang="ts">
import { ref } from 'vue';
import { Badge, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const count = ref(5);
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Badge :count="count">
        <Button>{{ isZh() ? '消息' : 'Messages' }}</Button>
      </Badge>
      <Badge :count="120" :max="99">
        <Button>{{ isZh() ? '通知' : 'Notifications' }}</Button>
      </Badge>
    </div>
    <div class="demo-row">
      <Button size="sm" @click="count = Math.max(0, count - 1)">-1</Button>
      <Button size="sm" type="primary" @click="count++">
        {{ isZh() ? '+1（试试超过 99）' : '+1 (try over 99)' }}
      </Button>
    </div>
  </div>
</template>
