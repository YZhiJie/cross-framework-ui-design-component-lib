import { useRef } from 'react';
import { Form, FormItem, Input, Button, Select } from '@xui-design/react';
import type { FormRef } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function FormValidationDemo() {
  const isZh = useIsZh();
  const formRef = useRef<FormRef>(null);

  const handleSubmit = (values: Record<string, unknown>) => {
    alert(isZh ? `提交成功：${JSON.stringify(values)}` : `Submitted: ${JSON.stringify(values)}`);
  };

  return (
    <Form
      ref={formRef}
      initialValues={{
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm: '',
        type: 'personal',
        company: '',
      }}
      rules={{
        name: [{ type: 'required', message: isZh ? '姓名必填' : 'Name is required' }],
        email: [
          { type: 'required', message: isZh ? '邮箱必填' : 'Email is required' },
          { type: 'email', message: isZh ? '邮箱格式不正确' : 'Invalid email format' },
        ],
        phone: [
          { type: 'required', message: isZh ? '手机号必填' : 'Phone is required' },
          { type: 'phone', message: isZh ? '手机号格式不正确' : 'Invalid phone number' },
        ],
        password: [
          { type: 'required', message: isZh ? '密码必填' : 'Password is required' },
          { type: 'length', min: 6, message: isZh ? '密码至少6位' : 'Password must be 6+ chars' },
        ],
        confirm: [
          { type: 'required', message: isZh ? '请确认密码' : 'Please confirm password' },
          {
            type: 'custom',
            message: isZh ? '两次密码不一致' : 'Passwords do not match',
            validator: (_v: unknown, values: Record<string, unknown>) =>
              values.password === values.confirm,
          },
        ],
        company: [
          {
            type: 'required',
            when: (values: Record<string, unknown>) => values.type === 'enterprise',
            message: isZh ? '企业名称必填' : 'Company name is required',
          },
        ],
      }}
      onSubmit={handleSubmit}
    >
      <FormItem name="name" label={isZh ? '姓名' : 'Name'}>
        <Input placeholder={isZh ? '请输入姓名' : 'Enter name'} />
      </FormItem>
      <FormItem name="email" label={isZh ? '邮箱' : 'Email'}>
        <Input placeholder={isZh ? '请输入邮箱' : 'Enter email'} />
      </FormItem>
      <FormItem name="phone" label={isZh ? '手机号' : 'Phone'}>
        <Input placeholder={isZh ? '请输入手机号' : 'Enter phone'} />
      </FormItem>
      <FormItem name="type" label={isZh ? '类型' : 'Type'}>
        <Select
          options={[
            { label: isZh ? '个人' : 'Personal', value: 'personal' },
            { label: isZh ? '企业' : 'Enterprise', value: 'enterprise' },
          ]}
        />
      </FormItem>
      <FormItem name="company" label={isZh ? '公司' : 'Company'}>
        <Input placeholder={isZh ? '企业用户必填' : 'Required for enterprise'} />
      </FormItem>
      <FormItem name="password" label={isZh ? '密码' : 'Password'}>
        <Input type="password" placeholder={isZh ? '至少6位' : 'At least 6 chars'} />
      </FormItem>
      <FormItem name="confirm" label={isZh ? '确认密码' : 'Confirm'}>
        <Input type="password" placeholder={isZh ? '再输一次' : 'Re-enter password'} />
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
