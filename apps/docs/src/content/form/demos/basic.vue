<script setup lang="ts">
import { ref } from 'vue';
import { Form, FormItem, Input, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formRef = ref<InstanceType<typeof Form> | null>(null);
const handleSubmit = (values: Record<string, unknown>) => {
  alert(isZh() ? `提交成功：${JSON.stringify(values)}` : `Submitted: ${JSON.stringify(values)}`);
};
</script>

<template>
  <Form
    ref="formRef"
    :initial-values="{ username: '', email: '' }"
    :rules="{
      username: [{ type: 'required', message: isZh() ? '请输入用户名' : 'Username is required' }],
      email: [
        { type: 'required', message: isZh() ? '请输入邮箱' : 'Email is required' },
        { type: 'email', message: isZh() ? '邮箱格式不正确' : 'Invalid email format' },
      ],
    }"
    @submit="handleSubmit"
  >
    <FormItem name="username" :label="isZh() ? '用户名' : 'Username'">
      <Input :placeholder="isZh() ? '请输入用户名' : 'Enter username'" />
    </FormItem>
    <FormItem name="email" :label="isZh() ? '邮箱' : 'Email'">
      <Input :placeholder="isZh() ? '请输入邮箱' : 'Enter email'" />
    </FormItem>
    <template #actions>
      <Button type="primary" @click="formRef?.submit()">{{ isZh() ? '提交' : 'Submit' }}</Button>
      <Button @click="formRef?.resetFields()">{{ isZh() ? '重置' : 'Reset' }}</Button>
    </template>
  </Form>
</template>
