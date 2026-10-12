<script setup lang="ts">
import { ref } from 'vue';
import { Spin, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const spinning = ref(true);
</script>

<template>
  <div class="demo-column">
    <Spin :spinning="spinning" :tip="isZh() ? '数据加载中' : 'Loading data'">
      <div class="demo-panel">
        <h4>{{ isZh() ? '被包裹的内容区' : 'Wrapped content area' }}</h4>
        <p>
          {{
            isZh()
              ? 'spinning 为 true 时覆盖半透明遮罩，false 时内容正常交互。'
              : 'When spinning is true, a semi-transparent overlay covers the content; when false, the content is fully interactive.'
          }}
        </p>
      </div>
    </Spin>
    <Button size="sm" @click="spinning = !spinning">
      {{
        spinning ? (isZh() ? '停止加载' : 'Stop loading') : isZh() ? '开始加载' : 'Start loading'
      }}
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
