import { useState } from 'react';
import { Select } from '@xui/react';
import type { SelectOption } from '@xui/core';

const options: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳（暂不可选）', value: 'shenzhen', disabled: true },
];

export default function SelectBasicDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="demo-column">
      <Select
        value={value}
        onChange={(v) => setValue(v as string)}
        options={options}
        placeholder="请选择城市"
        clearable
      />
      <p className="demo-text">当前选中：{value || '（未选择）'}</p>
    </div>
  );
}
