import { useState } from 'react';
import { RadioGroup } from '@xui-design/react';
import type { RadioOption } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function RadioOptionsDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('weekly');
  const options: RadioOption[] = [
    { label: isZh ? '每天' : 'Daily', value: 'daily' },
    { label: isZh ? '每周' : 'Weekly', value: 'weekly' },
    { label: isZh ? '每月' : 'Monthly', value: 'monthly' },
    { label: isZh ? '从不（禁用）' : 'Never (disabled)', value: 'never', disabled: true },
  ];

  return (
    <div className="demo-column">
      <RadioGroup value={value} onChange={setValue} options={options} />
      <RadioGroup options={options} disabled />
    </div>
  );
}
