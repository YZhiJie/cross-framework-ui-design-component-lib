<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from '@xui-design/vue';
import type { UploadFile } from '@xui-design/core';
import { isZh } from '../../../i18n';

const fileList = ref<UploadFile[]>([]);

const mockRequest = (
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void },
) =>
  new Promise<{ url: string }>((resolve) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 25;
      options.onProgress(Math.min(percent, 100));
      if (percent >= 100) {
        clearInterval(timer);
        resolve({ url: `https://example.com/${file.name}` });
      }
    }, 200);
  });

// 仅允许图片类型
const beforeUpload = (file: File) => file.type.startsWith('image/');
</script>

<template>
  <div class="demo-column">
    <Upload
      v-model:value="fileList"
      action="/upload"
      :request-upload="mockRequest"
      list-type="picture"
      accept="image/*"
      :max-count="3"
      :before-upload="beforeUpload"
    />
    <p class="demo-text">
      {{
        isZh()
          ? 'listType="picture" 图片列表；accept 限制图片；maxCount=3；beforeUpload 校验类型'
          : 'listType="picture" image list; accept restricts to images; maxCount=3; beforeUpload validates type'
      }}
    </p>
  </div>
</template>
