<script setup lang="ts">
import { InputNumber } from '@xui-design/vue';
</script>

<template>
  <div class="demo-column">
    <InputNumber :default-value="3" :min="1" :max="5" placeholder="非受控，1 - 5" />
    <InputNumber :default-value="8" disabled placeholder="禁用态" />
  </div>
</template>
