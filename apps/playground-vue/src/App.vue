<script setup lang="ts">
import { ref } from 'vue';
import {
  Button,
  Input,
  Modal,
  Switch,
  Checkbox,
  Tag,
  Alert,
  RadioGroup,
  Radio,
  Progress,
  Badge,
  Avatar,
  Empty,
} from '@xui/vue';
import '@xui/styles';

const name = ref('');
const modalVisible = ref(false);
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const switchValue = ref(false);
const checkboxValue = ref(true);
const radioValue = ref('a');
const radioCity = ref('beijing');
const progressValue = ref(60);
const log = ref<string[]>([]);

const radioCityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Disabled', value: 'gz', disabled: true },
];

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
      <h2>Switch</h2>
      <div class="row">
        <Switch v-model:value="switchValue" @change="(v: boolean) => pushLog(`switch: ${v}`)" />
        <Switch default-value size="sm" />
        <Switch default-value />
        <Switch disabled />
        <Switch loading />
      </div>
      <p class="hint">v-model:value = {{ switchValue }}</p>
    </section>

    <section>
      <h2>Checkbox</h2>
      <div class="row">
        <Checkbox v-model:value="checkboxValue" @change="(v: boolean) => pushLog(`checkbox: ${v}`)">
          agree terms
        </Checkbox>
        <Checkbox :value="false" indeterminate>indeterminate</Checkbox>
        <Checkbox disabled>disabled</Checkbox>
      </div>
      <p class="hint">v-model:value = {{ checkboxValue }}</p>
    </section>

    <section>
      <h2>Tag</h2>
      <div class="row">
        <Tag>default</Tag>
        <Tag type="primary">primary</Tag>
        <Tag type="success">success</Tag>
        <Tag type="warning">warning</Tag>
        <Tag type="danger">danger</Tag>
        <Tag size="sm">small</Tag>
        <Tag closable @close="pushLog('tag closed')">closable</Tag>
      </div>
    </section>

    <section>
      <h2>Alert</h2>
      <div class="column">
        <Alert
          title="Info"
          description="This is an info alert."
          show-icon
          closable
          @close="pushLog('alert closed')"
        />
        <Alert type="success" title="Success" description="Operation completed." show-icon />
        <Alert type="warning" title="Warning" description="Please check your input." show-icon />
        <Alert type="error" title="Error" description="Something went wrong." show-icon />
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
      ref="modalRef"
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
      <h2>RadioGroup / Radio</h2>
      <div class="row">
        <RadioGroup v-model:value="radioValue" @change="(v: string) => pushLog(`radio: ${v}`)">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
          <Radio value="c" disabled>C (disabled)</Radio>
        </RadioGroup>
        <span class="hint">v-model:value = {{ radioValue }}</span>
      </div>
      <div class="row">
        <RadioGroup
          v-model:value="radioCity"
          :options="radioCityOptions"
          @change="(v: string) => pushLog(`radio city: ${v}`)"
        />
        <span class="hint">options 渲染 = {{ radioCity }}</span>
      </div>
      <div class="row">
        <RadioGroup disabled default-value="b">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
        <span class="hint">整组禁用</span>
      </div>
    </section>

    <section>
      <h2>Progress</h2>
      <Progress :percent="progressValue" />
      <Progress :percent="100" />
      <Progress :percent="72" status="error" />
      <Progress :percent="45" :stroke-width="10" :show-text="false" />
      <div class="row">
        <Progress type="circle" :percent="progressValue" />
        <Progress type="circle" :percent="100" status="success" />
      </div>
      <div class="row">
        <Button size="sm" @click="progressValue = Math.max(0, progressValue - 10)">-10</Button>
        <Button size="sm" @click="progressValue = Math.min(100, progressValue + 10)">+10</Button>
        <span class="hint">percent = {{ progressValue }}</span>
      </div>
    </section>

    <section>
      <h2>Badge / Avatar</h2>
      <div class="row">
        <Badge :count="5">
          <Button>inbox</Button>
        </Badge>
        <Badge :count="120">
          <Button>overflow 99+</Button>
        </Badge>
        <Badge dot>
          <Button>dot</Button>
        </Badge>
        <Badge :count="0" show-zero>
          <Button>showZero</Button>
        </Badge>
        <Badge :count="9" />
        <span class="hint">独立模式 count=9 ↑</span>
      </div>
      <div class="row">
        <Avatar
          src="https://i.pravatar.cc/80?img=5"
          alt="user"
          @error="pushLog('avatar load error')"
        />
        <Avatar size="sm">S</Avatar>
        <Avatar size="lg">L</Avatar>
        <Avatar shape="square">SQ</Avatar>
      </div>
    </section>

    <section>
      <h2>Empty</h2>
      <Empty description="No data yet">
        <Button size="sm" type="primary" @click="pushLog('empty action clicked')"
          >Create now</Button
        >
      </Empty>
    </section>

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
.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: #6b7280;
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
