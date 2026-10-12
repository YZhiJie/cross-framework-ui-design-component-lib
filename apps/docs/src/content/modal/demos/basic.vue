<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const visible = ref(false);
</script>

<template>
  <div class="demo-column">
    <Button type="primary" @click="visible = true">{{
      isZh() ? '打开对话框' : 'Open modal'
    }}</Button>
    <Modal
      v-model:visible="visible"
      :title="isZh() ? '操作确认' : 'Confirm action'"
      @ok="visible = false"
      @cancel="visible = false"
    >
      <p>
        {{
          isZh()
            ? '这是一段对话框内容，确认后将执行对应操作。'
            : 'Modal body text. Confirm to proceed with the action.'
        }}
      </p>
      <template #footer>
        <Button @click="visible = false">{{ isZh() ? '取消' : 'Cancel' }}</Button>
        <Button type="primary" @click="visible = false">{{ isZh() ? '确认' : 'Confirm' }}</Button>
      </template>
    </Modal>
  </div>
</template>
