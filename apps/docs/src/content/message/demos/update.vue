<script setup lang="ts">
import { ref } from 'vue';
import { Button, message } from '@xui-design/vue';
import { isZh } from '../../../i18n';

let progress = 0;
const closed = ref(false);

const startUpload = () => {
  progress = 0;
  closed.value = false;
  message.open({
    content: isZh() ? `上传中 ${progress}%` : `Uploading ${progress}%`,
    key: 'upload',
    duration: 0,
  });
};

const stepUpload = () => {
  progress = Math.min(progress + 25, 100);
  if (progress < 100) {
    message.open({
      content: isZh() ? `上传中 ${progress}%` : `Uploading ${progress}%`,
      key: 'upload',
      duration: 0,
    });
  } else {
    message.open({
      content: isZh() ? '上传完成' : 'Upload complete',
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
      <Button type="primary" @click="startUpload">{{
        isZh() ? '开始上传' : 'Start upload'
      }}</Button>
      <Button @click="stepUpload">{{ isZh() ? '推进进度' : 'Advance progress' }}</Button>
    </div>
    <p class="demo-text">
      {{
        isZh()
          ? '同 key 反复 open 原地刷新进度（不堆叠消息）；完成后自动关闭并触发 onClose（已触发：'
          : 'Repeatedly open with the same key to refresh progress in place (no message stacking); auto-closes when done and triggers onClose (triggered: '
      }}{{ closed ? (isZh() ? '是' : 'yes') : isZh() ? '否' : 'no' }})
    </p>
  </div>
</template>
