<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from '@xui-design/vue';
import type { UploadFile } from '@xui-design/core';
import { isZh } from '../../../i18n';

const fileList = ref<UploadFile[]>([]);

// 文档站无真实后端，用模拟上传：1 秒后完成，进度匀速推进
const mockRequest = (
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void },
) =>
  new Promise<{ url: string }>((resolve) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 20;
      options.onProgress(Math.min(percent, 100));
      if (percent >= 100) {
        clearInterval(timer);
        resolve({ url: `https://example.com/${file.name}` });
      }
    }, 200);
  });
</script>

<template>
  <div class="demo-column">
    <Upload v-model:value="fileList" action="/upload" :request-upload="mockRequest" multiple />
    <p class="demo-text">
      {{ isZh() ? `文件数：${fileList.length}` : `File count: ${fileList.length}` }}
    </p>
  </div>
</template>
