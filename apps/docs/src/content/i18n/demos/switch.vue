<script setup lang="ts">
import { computed, ref } from 'vue';
import { getLocale, setLocale } from '@xui-design/vue';
import { Button, DatePicker, Modal, Table, Tag } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const current = ref(getLocale());
const visible = ref(false);

const columns = computed(() => [
  { key: 'name', title: isZh() ? '名称' : 'Name' },
  { key: 'age', title: isZh() ? '年龄' : 'Age' },
]);

const apply = (locale: string) => {
  setLocale(locale);
  current.value = getLocale();
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" @click="apply('zh-CN')">{{ isZh() ? '中文' : 'Chinese' }}</Button>
      <Button @click="apply('en-US')">English</Button>
      <Tag type="primary">{{ current }}</Tag>
    </div>
    <div class="demo-row">
      <Button type="link" @click="visible = true">{{
        isZh() ? '打开 Modal' : 'Open Modal'
      }}</Button>
    </div>
    <Modal v-model:visible="visible" :title="isZh() ? '国际化演示' : 'i18n Demo'">
      {{
        isZh()
          ? '底部按钮文案随全局语言切换；点击确认或取消关闭。'
          : 'Footer button text follows the global locale; click OK or Cancel to close.'
      }}
    </Modal>
    <Table :columns="columns" :data-source="[]" />
    <DatePicker style="width: 240px" />
  </div>
</template>
