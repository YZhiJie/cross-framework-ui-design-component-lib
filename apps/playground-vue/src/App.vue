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
  Select,
  Tabs,
  Tooltip,
  DatePicker,
  Pagination,
  Table,
  Spin,
  Breadcrumb,
  Skeleton,
  InputNumber,
  Popconfirm,
  message,
} from '@xui-design/vue';
import '@xui-design/styles';
import type {
  BreadcrumbItem,
  SelectValue,
  TableColumn,
  TableRow,
  TableRowKey,
  TableSort,
} from '@xui-design/core';

const name = ref('');
const modalVisible = ref(false);
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const switchValue = ref(false);
const checkboxValue = ref(true);
const radioValue = ref('a');
const radioCity = ref('beijing');
const progressValue = ref(60);
const tabsValue = ref('a');
const dateValue = ref<string | [string, string]>('');
const pageValue = ref(2);
const spinValue = ref(true);
const skeletonLoading = ref(true);
const numberValue = ref<number | null>(2);
const log = ref<string[]>([]);

const radioCityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Disabled', value: 'gz', disabled: true },
];

const selectOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai', disabled: true },
  { label: 'Guangzhou', value: 'guangzhou' },
  { label: 'Shenzhen', value: 'shenzhen' },
];

// 虚拟滚动演示：1000 项选项
const bigSelectOptions = Array.from({ length: 1000 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `opt-${i + 1}`,
}));

const tabsItems = [
  { label: 'Tab One', value: 'a' },
  { label: 'Tab Disabled', value: 'b', disabled: true },
  { label: 'Tab Two', value: 'c' },
];

const tableColumns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', sortable: true, width: 100, align: 'center' },
  { key: 'city', title: '城市' },
  {
    key: 'action',
    title: '操作',
    render: (record) => `查看 ${String(record.name)}`,
  },
];

const tableRows = [
  { id: 1, name: '张三', age: 30, city: 'Beijing' },
  { id: 2, name: '李四', age: 25, city: 'Shanghai' },
  { id: 3, name: '王五', age: 28, city: 'Guangzhou' },
  { id: 4, name: '赵六', age: 32, city: 'Shenzhen' },
];

// 虚拟滚动演示：1000 行数据
const bigTableRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + (i % 40),
  city: `城市${(i % 20) + 1}`,
}));

const breadcrumbItems: BreadcrumbItem[] = [
  { label: '首页', href: '#home' },
  { label: '组件', href: '#components' },
  { label: '当前页' },
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
      <h2>Select</h2>
      <div class="row">
        <Select
          :options="selectOptions"
          placeholder="Select a city"
          clearable
          @change="(v: SelectValue) => pushLog(`select: ${v}`)"
          @clear="pushLog('select cleared')"
        />
        <Select :options="selectOptions" disabled placeholder="Disabled" />
      </div>
      <div class="row">
        <Select
          :options="selectOptions"
          multiple
          :default-value="['beijing']"
          placeholder="Multiple"
          @change="(v: SelectValue) => pushLog(`select multi: ${JSON.stringify(v)}`)"
        />
        <Select
          :options="selectOptions"
          searchable
          placeholder="Searchable"
          @change="(v: SelectValue) => pushLog(`select search: ${v}`)"
        />
        <Select
          :options="bigSelectOptions"
          virtual
          :max-height="200"
          placeholder="Virtual 1000 items"
          @change="(v: SelectValue) => pushLog(`select virtual: ${v}`)"
        />
      </div>
    </section>

    <section>
      <h2>Tabs</h2>
      <Tabs
        v-model:value="tabsValue"
        :items="tabsItems"
        @change="(v: string) => pushLog(`tabs: ${v}`)"
      >
        <template #default="{ item }">Content of {{ item.label }}</template>
      </Tabs>
    </section>

    <section>
      <h2>Message</h2>
      <div class="row">
        <Button @click="message.info('This is an info message')">Info</Button>
        <Button type="primary" @click="message.success('Saved successfully')">Success</Button>
        <Button @click="message.warning('Disk space is low')">Warning</Button>
        <Button @click="message.error('Failed to save')">Error</Button>
        <Button @click="message.open({ content: 'Closable message', closable: true, duration: 0 })">
          Closable
        </Button>
        <Button @click="message.closeAll()">Close all</Button>
      </div>
    </section>

    <section>
      <h2>Tooltip</h2>
      <div class="row">
        <Tooltip content="顶部提示（默认）">
          <Button>top</Button>
        </Tooltip>
        <Tooltip content="底部提示" placement="bottom">
          <Button>bottom</Button>
        </Tooltip>
        <Tooltip content="左侧提示" placement="left">
          <Button>left</Button>
        </Tooltip>
        <Tooltip content="右侧提示" placement="right">
          <Button>right</Button>
        </Tooltip>
        <Tooltip content="聚焦触发" trigger="focus">
          <Input placeholder="focus 触发" />
        </Tooltip>
        <Tooltip content="禁用状态" disabled>
          <Button>disabled</Button>
        </Tooltip>
      </div>
    </section>

    <section>
      <h2>DatePicker</h2>
      <div class="row">
        <DatePicker
          v-model:value="dateValue"
          placeholder="选择日期"
          clearable
          @change="(v: string | [string, string]) => pushLog(`date: ${v}`)"
          @clear="pushLog('date cleared')"
        />
        <DatePicker disabled placeholder="Disabled" />
      </div>
      <p class="hint">v-model:value = {{ dateValue || '(未选择)' }}</p>
    </section>

    <section>
      <h2>Pagination</h2>
      <Pagination
        v-model:value="pageValue"
        :total="285"
        @change="(p: number) => pushLog(`page: ${p}`)"
      />
      <div class="row">
        <Pagination :total="50" disabled />
        <span class="hint">v-model:value = {{ pageValue }}</span>
      </div>
    </section>

    <section>
      <h2>Table</h2>
      <Table
        :columns="tableColumns"
        :data-source="tableRows"
        row-key="id"
        stripe
        border
        :row-selection="{
          onChange: (keys: TableRowKey[]) => pushLog(`select rows: ${JSON.stringify(keys)}`),
        }"
        @row-click="
          (row: TableRow, index: number) => pushLog(`row click: ${String(row.name)} #${index}`)
        "
        @sort-change="(s: TableSort) => pushLog(`sort: ${s.key} ${s.order ?? 'none'}`)"
      />
      <Table :columns="tableColumns" :data-source="[]" style="margin-top: 12px">
        <template #empty>
          <span>自定义空态：没有更多数据啦</span>
        </template>
      </Table>
      <Table
        :columns="tableColumns"
        :data-source="bigTableRows"
        row-key="id"
        virtual
        :height="320"
        :row-height="40"
        stripe
        style="margin-top: 12px"
      />
    </section>

    <section>
      <h2>Spin</h2>
      <div class="row">
        <Spin size="sm" />
        <Spin />
        <Spin size="lg" />
        <Spin tip="加载中..." />
        <span class="hint">独立模式（三档尺寸 + tip）</span>
      </div>
      <div class="row">
        <Spin :spinning="spinValue" tip="数据加载中">
          <div style="padding: 16px; border: 1px dashed #d1d5db">
            这里是被包裹的内容，加载时模糊化
          </div>
        </Spin>
        <Button @click="spinValue = !spinValue">
          {{ spinValue ? '停止加载' : '开始加载' }}
        </Button>
      </div>
    </section>

    <section>
      <h2>Breadcrumb</h2>
      <Breadcrumb
        :items="breadcrumbItems"
        separator=">"
        @item-click="
          (item: BreadcrumbItem, index: number) =>
            pushLog(`breadcrumb: ${item.label} (index=${index})`)
        "
      />
    </section>

    <section>
      <h2>Skeleton</h2>
      <div class="row">
        <Button @click="skeletonLoading = !skeletonLoading">
          {{ skeletonLoading ? '显示内容' : '显示骨架' }}
        </Button>
        <span class="hint">loading = {{ skeletonLoading }}</span>
      </div>
      <Skeleton :loading="skeletonLoading" avatar :rows="3">
        <div style="display: flex; gap: 12px; align-items: center">
          <Avatar size="lg">X</Avatar>
          <span>骨架屏内容加载完成，头像 + 文本正常渲染</span>
        </div>
      </Skeleton>
    </section>

    <section>
      <h2>InputNumber</h2>
      <div class="row">
        <InputNumber
          v-model:value="numberValue"
          :min="0"
          :max="10"
          :step="0.5"
          :precision="2"
          placeholder="0.00 ~ 10.00"
          @change="(v: number | null) => pushLog(`input-number: ${v}`)"
        />
        <span class="hint">v-model:value = {{ numberValue ?? 'null' }}</span>
      </div>
      <div class="row">
        <InputNumber :default-value="5" disabled />
        <InputNumber :default-value="3" :min="1" :max="5" />
        <span class="hint">disabled / 非受控（边界 clamp）</span>
      </div>
    </section>

    <section>
      <h2>Popconfirm</h2>
      <div class="row">
        <Popconfirm
          content="确定删除这条记录吗？"
          @confirm="pushLog('popconfirm: 已删除')"
          @cancel="pushLog('popconfirm: 已取消')"
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
        <Popconfirm
          content="右侧方位弹出，自定义按钮文本"
          placement="right"
          confirm-text="好的"
          cancel-text="再想想"
          @confirm="pushLog('popconfirm: 确认执行')"
        >
          <Button>右侧 + 自定义文本</Button>
        </Popconfirm>
        <Popconfirm content="禁用状态不可触发" disabled>
          <Button disabled>disabled</Button>
        </Popconfirm>
      </div>
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
.row > :deep(.xui-select) {
  flex: 0 1 240px;
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
