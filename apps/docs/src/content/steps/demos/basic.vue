<script setup lang="ts">
import { ref } from 'vue';
import { Steps, Button } from '@xui-design/vue';
import type { StepItem } from '@xui-design/core';
import { isZh } from '../../../i18n';

const items: StepItem[] = [
  { key: 'info', title: isZh() ? '填写信息' : 'Fill Info', description: isZh() ? '完善基本资料' : 'Complete profile' },
  { key: 'verify', title: isZh() ? '身份验证' : 'Verify' },
  { key: 'pay', title: isZh() ? '确认下单' : 'Confirm' },
  { key: 'done', title: isZh() ? '完成' : 'Done' },
];

const current = ref(1);

const errorItems: StepItem[] = [
  { key: 'upload', title: isZh() ? '上传文件' : 'Upload' },
  { key: 'check', title: isZh() ? '校验中' : 'Checking' },
  { key: 'publish', title: isZh() ? '发布' : 'Publish' },
];
</script>

<template>
  <div class="demo-column">
    <Steps v-model:value="current" :items="items" />
    <div class="demo-row">
      <Button @click="current = Math.max(0, current - 1)">{{ isZh() ? '上一步' : 'Prev' }}</Button>
      <Button @click="current = Math.min(items.length - 1, current + 1)">
        {{ isZh() ? '下一步' : 'Next' }}
      </Button>
      <span class="demo-text">{{ isZh() ? `当前：第 ${current + 1} 步` : `Current: ${current + 1}` }}</span>
    </div>
    <Steps :items="errorItems" :value="1" status="error" />
  </div>
</template>
