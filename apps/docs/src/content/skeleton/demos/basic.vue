<script setup lang="ts">
import { ref } from 'vue';
import { Skeleton, Button } from '@xui/vue';

const loading = ref(true);
</script>

<template>
  <div class="demo-column">
    <Skeleton :loading="loading" :rows="3">
      <div class="demo-article">
        <h4>加载完成后的真实内容</h4>
        <p>这是一段从服务端获取的数据，loading 为 false 时替换骨架屏渲染。</p>
      </div>
    </Skeleton>
    <Button size="sm" @click="loading = !loading">
      {{ loading ? '加载完成' : '重新加载' }}
    </Button>
  </div>
</template>

<style scoped>
.demo-article h4 {
  margin: 0 0 8px;
}

.demo-article p {
  margin: 0;
  color: #6b7280;
}
</style>
