import { useState } from 'react';
import { RadioGroup, Radio } from '@xui-design/react';

export default function RadioGroupDemo() {
  const [value, setValue] = useState('a');

  return (
    <div className="demo-column">
      <RadioGroup value={value} onChange={setValue}>
        <Radio value="a">选项 A</Radio>
        <Radio value="b">选项 B</Radio>
        <Radio value="c" disabled>
          选项 C（禁用）
        </Radio>
      </RadioGroup>
      <p className="demo-text">当前选中：{value}</p>
    </div>
  );
}
