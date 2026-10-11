<script setup lang="ts">
import { ref } from 'vue';
import { Spin, Button } from '@xui/vue';

const spinning = ref(true);
</script>

<template>
  <div class="demo-column">
    <Spin :spinning="spinning" tip="数据加载中">
      <div class="demo-panel">
        <h4>被包裹的内容区</h4>
        <p>spinning 为 true 时覆盖半透明遮罩，false 时内容正常交互。</p>
      </div>
    </Spin>
    <Button size="sm" @click="spinning = !spinning">
      {{ spinning ? '停止加载' : '开始加载' }}
    </Button>
  </div>
</template>

<style scoped>
.demo-panel {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.demo-panel h4 {
  margin: 0 0 8px;
}

.demo-panel p {
  margin: 0;
  color: #6b7280;
}
</style>
