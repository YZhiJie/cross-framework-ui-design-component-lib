<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@xui/vue';

const visible = ref(false);
</script>

<template>
  <div class="demo-column">
    <Button type="primary" @click="visible = true">打开对话框</Button>
    <Modal
      v-model:visible="visible"
      title="操作确认"
      @ok="visible = false"
      @cancel="visible = false"
    >
      <p>这是一段对话框内容，确认后将执行对应操作。</p>
      <template #footer>
        <Button @click="visible = false">取消</Button>
        <Button type="primary" @click="visible = false">确认</Button>
      </template>
    </Modal>
  </div>
</template>
