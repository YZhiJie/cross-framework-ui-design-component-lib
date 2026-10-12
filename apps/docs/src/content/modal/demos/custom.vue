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
      :title="isZh() ? '删除确认' : 'Delete confirmation'"
      :ok-text="isZh() ? '确认删除' : 'Confirm delete'"
      :cancel-text="isZh() ? '再想想' : 'Maybe later'"
      @ok="visible = false"
      @cancel="visible = false"
    >
      <p>
        {{
          isZh()
            ? '删除后不可恢复，请谨慎操作。底部按钮文案由 okText / cancelText 自定义。'
            : 'Deletion is irreversible, proceed with caution. Footer button text is customized via okText / cancelText.'
        }}
      </p>
    </Modal>
  </div>
</template>
