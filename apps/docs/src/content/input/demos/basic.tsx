import { useState } from 'react';
import { Input } from '@xui-design/react';

export default function InputBasicDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="demo-column">
      <Input value={value} onInput={setValue} placeholder="输入点内容..." clearable />
      <p className="demo-text">当前值：{value || '（空）'}</p>
    </div>
  );
}
