<script setup lang="ts">
import { ref } from 'vue';
import { Button, message } from '@xui-design/vue';

let progress = 0;
const closed = ref(false);

const startUpload = () => {
  progress = 0;
  closed.value = false;
  message.open({ content: '上传中 0%', key: 'upload', duration: 0 });
};

const stepUpload = () => {
  progress = Math.min(progress + 25, 100);
  if (progress < 100) {
    message.open({ content: `上传中 ${progress}%`, key: 'upload', duration: 0 });
  } else {
    message.open({
      content: '上传完成',
      key: 'upload',
      type: 'success',
      duration: 3000,
      onClose: () => {
        closed.value = true;
      },
    });
  }
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" @click="startUpload">开始上传</Button>
      <Button @click="stepUpload">推进进度</Button>
    </div>
    <p class="demo-text">
      同 key 反复 open 原地刷新进度（不堆叠消息）；完成后自动关闭并触发 onClose（已触发：
      {{ closed ? '是' : '否' }}）
    </p>
  </div>
</template>
