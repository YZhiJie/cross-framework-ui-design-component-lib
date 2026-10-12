<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@xui-design/vue';

const checked = ref(true);
</script>

<template>
  <div class="demo-column">
    <Checkbox v-model:value="checked">我已阅读并同意用户协议</Checkbox>
    <p class="demo-text">当前选中：{{ checked ? '是' : '否' }}</p>
  </div>
</template>
