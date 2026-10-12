<script setup lang="ts">
import { ref } from 'vue';
import { Form, FormItem, Input, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formRef = ref<InstanceType<typeof Form> | null>(null);
const fields = ref([{ key: 0, label: isZh() ? '联系人 1' : 'Contact 1' }]);
let nextKey = 1;

const addField = () => {
  nextKey += 1;
  fields.value.push({
    key: nextKey,
    label: isZh() ? `联系人 ${fields.value.length + 1}` : `Contact ${fields.value.length + 1}`,
  });
};

const removeField = (index: number) => {
  fields.value.splice(index, 1);
};

const handleSubmit = (values: Record<string, unknown>) => {
  alert(isZh() ? `提交成功：${JSON.stringify(values)}` : `Submitted: ${JSON.stringify(values)}`);
};
</script>

<template>
  <Form ref="formRef" :initial-values="{}" @submit="handleSubmit">
    <FormItem
      v-for="(field, index) in fields"
      :key="field.key"
      :name="`contact_${field.key}`"
      :label="field.label"
    >
      <Input :placeholder="isZh() ? '请输入' : 'Enter value'" />
      <template #extra>
        <Button v-if="fields.length > 1" size="sm" @click="removeField(index)">
          {{ isZh() ? '删除' : 'Remove' }}
        </Button>
      </template>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="addField">{{ isZh() ? '添加字段' : 'Add Field' }}</Button>
    </FormItem>
    <template #actions>
      <Button type="primary" @click="formRef?.submit()">{{ isZh() ? '提交' : 'Submit' }}</Button>
      <Button @click="formRef?.resetFields()">{{ isZh() ? '重置' : 'Reset' }}</Button>
    </template>
  </Form>
</template>
