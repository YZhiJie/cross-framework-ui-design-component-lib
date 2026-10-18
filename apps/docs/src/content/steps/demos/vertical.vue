<script setup lang="ts">
import { Steps } from '@xui-design/vue';
import type { StepItem } from '@xui-design/core';
import { isZh } from '../../../i18n';

const items: StepItem[] = [
  { key: 'order', title: isZh() ? '创建订单' : 'Create Order', description: isZh() ? '2026-10-18' : '2026-10-18' },
  { key: 'ship', title: isZh() ? '商家发货' : 'Shipped', description: isZh() ? '顺丰速运' : 'SF Express' },
  { key: 'transit', title: isZh() ? '运输中' : 'In Transit' },
  { key: 'sign', title: isZh() ? '签收' : 'Signed' },
];
</script>

<template>
  <div class="demo-column">
    <Steps :items="items" :value="2" direction="vertical" style="max-width: 320px" />
  </div>
</template>
