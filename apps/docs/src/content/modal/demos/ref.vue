<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <div class="demo-column">
    <Button @click="modalRef?.open()">{{ isZh() ? '通过 ref 打开' : 'Open via ref' }}</Button>
    <Modal ref="modalRef" :title="isZh() ? '命令式控制' : 'Imperative control'" width="420px">
      <p>
        {{
          isZh()
            ? '不需要维护 visible 状态，直接调用实例方法 open() / close()。'
            : 'No need to manage visible state manually; call instance methods open() / close() directly.'
        }}
      </p>
    </Modal>
  </div>
</template>
