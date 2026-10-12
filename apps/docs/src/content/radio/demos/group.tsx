import { useState } from 'react';
import { RadioGroup, Radio } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function RadioGroupDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('a');

  return (
    <div className="demo-column">
      <RadioGroup value={value} onChange={setValue}>
        <Radio value="a">{isZh ? '选项 A' : 'Option A'}</Radio>
        <Radio value="b">{isZh ? '选项 B' : 'Option B'}</Radio>
        <Radio value="c" disabled>
          {isZh ? '选项 C（禁用）' : 'Option C (disabled)'}
        </Radio>
      </RadioGroup>
      <p className="demo-text">
        {isZh ? '当前选中' : 'Selected'}：{value}
      </p>
    </div>
  );
}
