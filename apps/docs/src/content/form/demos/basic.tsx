import { useRef } from 'react';
import { Form, FormItem, Input, Button } from '@xui-design/react';
import type { FormRef } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function FormBasicDemo() {
  const isZh = useIsZh();
  const formRef = useRef<FormRef>(null);

  const handleSubmit = (values: Record<string, unknown>) => {
    alert(isZh ? `提交成功：${JSON.stringify(values)}` : `Submitted: ${JSON.stringify(values)}`);
  };

  return (
    <Form
      ref={formRef}
      initialValues={{ username: '', email: '' }}
      rules={{
        username: [{ type: 'required', message: isZh ? '请输入用户名' : 'Username is required' }],
        email: [
          { type: 'required', message: isZh ? '请输入邮箱' : 'Email is required' },
          { type: 'email', message: isZh ? '邮箱格式不正确' : 'Invalid email format' },
        ],
      }}
      onSubmit={handleSubmit}
    >
      <FormItem name="username" label={isZh ? '用户名' : 'Username'}>
        <Input placeholder={isZh ? '请输入用户名' : 'Enter username'} />
      </FormItem>
      <FormItem name="email" label={isZh ? '邮箱' : 'Email'}>
        <Input placeholder={isZh ? '请输入邮箱' : 'Enter email'} />
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
