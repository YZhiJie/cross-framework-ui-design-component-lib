<script setup lang="ts">
import { ref } from 'vue';
import { getLocale, registerLocale, setLocale } from '@xui-design/vue';
import { Button, Modal, Popconfirm, Table, Tag } from '@xui-design/vue';

const current = ref(getLocale());
const visible = ref(false);
const registered = ref(false);

const columns = [
  { key: 'name', title: '名称' },
  { key: 'age', title: '年龄' },
];

const registerJapanese = () => {
  registerLocale('ja-JP', {
    modal: { ok: 'OK', cancel: 'キャンセル' },
    popconfirm: { confirm: 'OK', cancel: 'キャンセル' },
    table: { empty: 'データがありません' },
  });
  registered.value = true;
  apply('ja-JP');
};

const apply = (locale: string) => {
  setLocale(locale);
  current.value = getLocale();
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" :disabled="registered" @click="registerJapanese">
        {{ registered ? '已注册 ja-JP' : '注册日语语言包' }}
      </Button>
      <Button @click="apply('zh-CN')">回到中文</Button>
      <Tag type="primary">{{ current }}</Tag>
    </div>
    <div class="demo-row">
      <Button type="link" @click="visible = true">打开 Modal</Button>
      <Popconfirm content="确认删除这条数据吗？">
        <Button>删除</Button>
      </Popconfirm>
    </div>
    <Modal v-model:visible="visible" title="自定义语言包">
      注册后所有组件文案按新语言渲染，未覆盖的分组回退注册时的基底包。
    </Modal>
    <Table :columns="columns" :data-source="[]" />
  </div>
</template>
