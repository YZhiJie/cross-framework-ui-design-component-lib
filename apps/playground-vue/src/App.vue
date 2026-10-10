<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input, Modal } from '@xui/vue';
import '@xui/styles';

const name = ref('');
const modalVisible = ref(false);
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const log = ref<string[]>([]);

const pushLog = (msg: string) => {
  log.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
};
</script>

<template>
  <div class="playground">
    <h1>XUI - Vue Playground</h1>
    <p class="subtitle">跨框架组件库 · Vue 3.5 适配层集成验证</p>

    <section>
      <h2>Button</h2>
      <div class="row">
        <Button>default</Button>
        <Button type="primary">primary</Button>
        <Button type="danger">danger</Button>
        <Button type="link">link</Button>
      </div>
      <div class="row">
        <Button size="sm">small</Button>
        <Button size="md">medium</Button>
        <Button size="lg">large</Button>
      </div>
      <div class="row">
        <Button disabled>disabled</Button>
        <Button loading>loading</Button>
        <Button block>block (full width)</Button>
      </div>
      <div class="row">
        <Button type="primary" @click="pushLog('button clicked')">click me</Button>
        <Button @click="modalVisible = true">open modal</Button>
      </div>
    </section>

    <section>
      <h2>Input</h2>
      <div class="row">
        <Input
          v-model:value="name"
          placeholder="type something..."
          clearable
          @input="(v: string) => pushLog(`input: ${v}`)"
          @change="(v: string) => pushLog(`change: ${v}`)"
          @clear="pushLog('cleared')"
        />
      </div>
      <div class="row">
        <Input value="disabled" disabled />
        <Input value="readonly" readonly />
        <Input placeholder="with prefix">
          <template #prefix>🔍</template>
        </Input>
      </div>
    </section>

    <section>
      <h2>Modal</h2>
      <div class="row">
        <Button type="primary" @click="modalVisible = true">show modal</Button>
        <Button @click="modalRef?.open()">open via ref</Button>
      </div>
    </section>

    <Modal
      v-model:visible="modalVisible"
      title="Hello XUI"
      :width="480"
      :closable="true"
      :mask-closable="true"
      :close-on-esc="true"
      @open="pushLog('modal open')"
      @close="pushLog('modal close')"
      @ok="pushLog('modal ok')"
      @cancel="pushLog('modal cancel')"
    >
      <p>
        Modal content here. Value from input: <strong>{{ name || '(empty)' }}</strong>
      </p>
      <template #footer>
        <Button @click="modalVisible = false">cancel</Button>
        <Button type="primary" @click="modalVisible = false">confirm</Button>
      </template>
    </Modal>

    <section>
      <h2>Event log</h2>
      <pre class="log">{{ log.join('\n') || '(no events yet)' }}</pre>
    </section>
  </div>
</template>

<style scoped>
.playground {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  color: #1f2937;
}
h1 {
  font-size: 24px;
  margin: 0 0 4px;
}
.subtitle {
  margin: 0 0 32px;
  color: #6b7280;
}
h2 {
  font-size: 16px;
  margin: 32px 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.row > :deep(.xui-input) {
  flex: 1 1 280px;
}
.log {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  max-height: 180px;
  overflow: auto;
}
</style>
