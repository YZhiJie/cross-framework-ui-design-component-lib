import { useRef, useState } from 'react';
import { Form, FormItem, Input, Button } from '@xui-design/react';
import type { FormRef } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

interface FieldItem {
  key: number;
  label: string;
}

export default function FormDynamicDemo() {
  const isZh = useIsZh();
  const formRef = useRef<FormRef>(null);
  const [fields, setFields] = useState<FieldItem[]>([
    { key: 0, label: isZh ? '联系人 1' : 'Contact 1' },
  ]);
  const [nextKey, setNextKey] = useState(1);

  const addField = () => {
    const newKey = nextKey + 1;
    setNextKey(newKey);
    setFields((prev) => [
      ...prev,
      { key: newKey, label: isZh ? `联系人 ${prev.length + 1}` : `Contact ${prev.length + 1}` },
    ]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    alert(isZh ? `提交成功：${JSON.stringify(values)}` : `Submitted: ${JSON.stringify(values)}`);
  };

  return (
    <Form ref={formRef} initialValues={{}} onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <FormItem key={field.key} name={`contact_${field.key}`} label={field.label}>
          <Input placeholder={isZh ? '请输入' : 'Enter value'} />
          <div className="xui-form-item__extra">
            <Button size="sm" onClick={() => removeField(index)}>
              {isZh ? '删除' : 'Remove'}
            </Button>
          </div>
        </FormItem>
      ))}
      <FormItem>
        <Button type="primary" onClick={addField}>
          {isZh ? '添加字段' : 'Add Field'}
        </Button>
      </FormItem>
      <div className="xui-form__actions">
        <Button type="primary" onClick={() => formRef.current?.submit()}>
          {isZh ? '提交' : 'Submit'}
        </Button>
        <Button onClick={() => formRef.current?.resetFields()}>{isZh ? '重置' : 'Reset'}</Button>
      </div>
    </Form>
  );
}
