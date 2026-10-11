<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@xui/vue';

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <div class="demo-column">
    <Button @click="modalRef?.open()">通过 ref 打开</Button>
    <Modal ref="modalRef" title="命令式控制" width="420px">
      <p>不需要维护 visible 状态，直接调用实例方法 open() / close()。</p>
    </Modal>
  </div>
</template>
