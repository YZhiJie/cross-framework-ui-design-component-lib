<script setup lang="ts">
import { computed, ref } from 'vue';
import { getLocale, registerLocale, setLocale } from '@xui-design/vue';
import { Button, Modal, Popconfirm, Table, Tag } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const current = ref(getLocale());
const visible = ref(false);
const registered = ref(false);

const columns = computed(() => [
  { key: 'name', title: isZh() ? '名称' : 'Name' },
  { key: 'age', title: isZh() ? '年龄' : 'Age' },
]);

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
        {{
          registered
            ? isZh()
              ? '已注册 ja-JP'
              : 'ja-JP registered'
            : isZh()
              ? '注册日语语言包'
              : 'Register Japanese locale'
        }}
      </Button>
      <Button @click="apply('zh-CN')">{{ isZh() ? '回到中文' : 'Back to Chinese' }}</Button>
      <Tag type="primary">{{ current }}</Tag>
    </div>
    <div class="demo-row">
      <Button type="link" @click="visible = true">{{
        isZh() ? '打开 Modal' : 'Open Modal'
      }}</Button>
      <Popconfirm
        :content="isZh() ? '确认删除这条数据吗？' : 'Are you sure you want to delete this record?'"
      >
        <Button>{{ isZh() ? '删除' : 'Delete' }}</Button>
      </Popconfirm>
    </div>
    <Modal v-model:visible="visible" :title="isZh() ? '自定义语言包' : 'Custom Locale'">
      {{
        isZh()
          ? '注册后所有组件文案按新语言渲染，未覆盖的分组回退注册时的基底包。'
          : 'After registration, all component text renders in the new language; uncovered groups fall back to the base pack at registration time.'
      }}
    </Modal>
    <Table :columns="columns" :data-source="[]" />
  </div>
</template>
