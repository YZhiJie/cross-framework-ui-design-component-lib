<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@xui-design/vue';

const indeterminate = ref(true);
</script>

<template>
  <div class="demo-column">
    <Checkbox v-model:indeterminate="indeterminate">全选（半选态，点击后变全选）</Checkbox>
    <Checkbox value disabled>禁用未选</Checkbox>
    <Checkbox :value="true" disabled>禁用已选</Checkbox>
  </div>
</template>
