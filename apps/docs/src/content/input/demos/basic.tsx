import { useState } from 'react';
import { Input } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function InputBasicDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('');

  return (
    <div className="demo-column">
      <Input
        value={value}
        onInput={setValue}
        placeholder={isZh ? '输入点内容...' : 'Type something...'}
        clearable
      />
      <p className="demo-text">
        {isZh ? '当前值：' : 'Current: '}
        {value || (isZh ? '（空）' : '(empty)')}
      </p>
    </div>
  );
}
