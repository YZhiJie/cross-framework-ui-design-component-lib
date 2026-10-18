<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const requestUpload = (file: { name: string }) =>
  new Promise<{ url: string }>((resolve) => {
    setTimeout(() => resolve({ url: `/mock/${encodeURIComponent(file.name)}` }), 600);
  });

const doneCount = ref(0);

function handleChange() {
  doneCount.value += 1;
}
</script>

<template>
  <div class="demo-column">
    <Upload
      action="/upload"
      :request-upload="requestUpload"
      drag
      multiple
      accept="image/*,.pdf"
      @change="handleChange"
    />
    <p class="demo-text">
      {{
        isZh()
          ? `已完成上传：${doneCount} 个文件（accept 限定图片与 PDF）`
          : `Uploaded: ${doneCount} (images and PDF only)`
      }}
    </p>
  </div>
</template>
