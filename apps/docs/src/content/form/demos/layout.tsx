import { useState } from 'react';
import { Form, FormItem, Input, Switch, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function FormLayoutDemo() {
  const isZh = useIsZh();
  const [disabled, setDisabled] = useState(false);
  const [labelPosition, setLabelPosition] = useState<'left' | 'right' | 'top'>('right');

  return (
    <div className="demo-column">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
        <label>{isZh ? '禁用表单' : 'Disabled'}</label>
        <Switch value={disabled} onChange={setDisabled} />
        <label>{isZh ? '标签位置' : 'Label'}</label>
        <Switch
          value={labelPosition === 'top'}
          checkedText={isZh ? '顶部' : 'Top'}
          uncheckedText={isZh ? '右' : 'Right'}
          onChange={(v: boolean) => setLabelPosition(v ? 'top' : 'right')}
        />
      </div>
      <Form
        disabled={disabled}
        labelPosition={labelPosition}
        initialValues={{ name: 'Alice', email: 'alice@test.com' }}
      >
        <FormItem name="name" label={isZh ? '姓名' : 'Name'}>
          <Input />
        </FormItem>
        <FormItem name="email" label={isZh ? '邮箱' : 'Email'}>
          <Input />
        </FormItem>
        <FormItem name="bio" label={isZh ? '简介' : 'Bio'}>
          <Input type="search" placeholder={isZh ? '一句话介绍自己' : 'Describe yourself'} />
        </FormItem>
        <div className="xui-form__actions">
          <Button type="primary" disabled={disabled}>
            {isZh ? '保存' : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
