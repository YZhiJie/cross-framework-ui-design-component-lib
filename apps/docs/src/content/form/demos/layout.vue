<script setup lang="ts">
import { ref } from 'vue';
import { Form, FormItem, Input, Switch, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const disabled = ref(false);
const labelPosition = ref<'left' | 'right' | 'top'>('right');
</script>

<template>
  <div class="demo-column">
    <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 8px">
      <label>{{ isZh() ? '禁用表单' : 'Disabled' }}</label>
      <Switch v-model:value="disabled" />
      <label>{{ isZh() ? '标签位置' : 'Label' }}</label>
      <Switch
        :value="labelPosition === 'top'"
        :checked-text="isZh() ? '顶部' : 'Top'"
        :unchecked-text="isZh() ? '右' : 'Right'"
        @change="(v: boolean) => (labelPosition = v ? 'top' : 'right')"
      />
    </div>
    <Form
      :disabled="disabled"
      :label-position="labelPosition"
      :initial-values="{ name: 'Alice', email: 'alice@test.com' }"
    >
      <FormItem name="name" :label="isZh() ? '姓名' : 'Name'">
        <Input />
      </FormItem>
      <FormItem name="email" :label="isZh() ? '邮箱' : 'Email'">
        <Input />
      </FormItem>
      <FormItem name="bio" :label="isZh() ? '简介' : 'Bio'">
        <Input type="search" :placeholder="isZh() ? '一句话介绍自己' : 'Describe yourself'" />
      </FormItem>
      <template #actions>
        <Button type="primary" :disabled="disabled">{{ isZh() ? '保存' : 'Save' }}</Button>
      </template>
    </Form>
  </div>
</template>
