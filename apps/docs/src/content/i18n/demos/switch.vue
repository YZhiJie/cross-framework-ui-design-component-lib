<script setup lang="ts">
import { ref } from 'vue';
import { getLocale, setLocale } from '@xui/vue';
import { Button, DatePicker, Modal, Table, Tag } from '@xui/vue';

const current = ref(getLocale());
const visible = ref(false);

const columns = [
  { key: 'name', title: '名称' },
  { key: 'age', title: '年龄' },
];

const apply = (locale: string) => {
  setLocale(locale);
  current.value = getLocale();
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" @click="apply('zh-CN')">中文</Button>
      <Button @click="apply('en-US')">English</Button>
      <Tag type="primary">{{ current }}</Tag>
    </div>
    <div class="demo-row">
      <Button type="link" @click="visible = true">打开 Modal</Button>
    </div>
    <Modal v-model:visible="visible" title="国际化演示">
      底部按钮文案随全局语言切换；点击确认或取消关闭。
    </Modal>
    <Table :columns="columns" :data-source="[]" />
    <DatePicker style="width: 240px" />
  </div>
</template>
