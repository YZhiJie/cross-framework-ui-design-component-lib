<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup, Radio } from '@xui-design/vue';

const value = ref('a');
</script>

<template>
  <div class="demo-column">
    <RadioGroup v-model:value="value">
      <Radio value="a">选项 A</Radio>
      <Radio value="b">选项 B</Radio>
      <Radio value="c" disabled>选项 C（禁用）</Radio>
    </RadioGroup>
    <p class="demo-text">当前选中：{{ value }}</p>
  </div>
</template>
