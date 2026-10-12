<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const loading = ref(false);
const submit = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1500);
};
</script>

<template>
  <div class="demo-row">
    <Button disabled>Disabled</Button>
    <Button loading>Loading</Button>
    <Button type="primary" :loading="loading" @click="submit">
      {{
        loading
          ? isZh()
            ? '提交中...'
            : 'Submitting...'
          : isZh()
            ? '点击模拟提交'
            : 'Click to submit'
      }}
    </Button>
  </div>
</template>
