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
      title="删除确认"
      ok-text="确认删除"
      cancel-text="再想想"
      @ok="visible = false"
      @cancel="visible = false"
    >
      <p>删除后不可恢复，请谨慎操作。底部按钮文案由 okText / cancelText 自定义。</p>
    </Modal>
  </div>
</template>
