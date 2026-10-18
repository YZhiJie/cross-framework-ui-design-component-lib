<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from '@xui-design/vue';
import type { UploadFile } from '@xui-design/core';

// 模拟上传：50% 概率成功，随机进度
const mockRequest = (
  file: UploadFile,
  options: { onProgress: (p: number) => void; signal?: AbortSignal },
) =>
  new Promise<{ url?: string; response?: unknown }>((resolve, reject) => {
    let percent = 0;
    const timer = setInterval(() => {
      if (options.signal?.aborted) {
        clearInterval(timer);
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      percent += Math.random() * 20 + 5;
      if (percent >= 100) {
        percent = 100;
        clearInterval(timer);
        if (Math.random() > 0.2) {
          resolve({ url: `https://example.com/${file.name}`, response: { ok: true } });
        } else {
          reject(new Error('模拟上传失败'));
        }
      }
      options.onProgress(Math.min(Math.round(percent), 100));
    }, 300);
  });

const value = ref<UploadFile[]>([]);
</script>

<template>
  <div class="demo-column">
    <Upload
      v-model:value="value"
      action="/upload"
      multiple
      :auto-upload="false"
      :request-upload="mockRequest"
    />
    <p class="demo-text">autoUpload=false：选中文件后进入「待上传」状态，点击「开始上传」手动触发。</p>
  </div>
</template>
