import { useState } from 'react';
import { RadioGroup } from '@xui/react';
import type { RadioOption } from '@xui/core';

const options: RadioOption[] = [
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
  { label: '从不（禁用）', value: 'never', disabled: true },
];

export default function RadioOptionsDemo() {
  const [value, setValue] = useState('weekly');

  return (
    <div className="demo-column">
      <RadioGroup value={value} onChange={setValue} options={options} />
      <RadioGroup options={options} disabled />
    </div>
  );
}
