import { useState } from 'react';
import { Select } from '@xui-design/react';
import type { SelectOption } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SelectBasicDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('');
  const options: SelectOption[] = [
    { label: isZh ? '北京' : 'Beijing', value: 'beijing' },
    { label: isZh ? '上海' : 'Shanghai', value: 'shanghai' },
    { label: isZh ? '广州' : 'Guangzhou', value: 'guangzhou' },
    {
      label: isZh ? '深圳（暂不可选）' : 'Shenzhen (unavailable)',
      value: 'shenzhen',
      disabled: true,
    },
  ];

  return (
    <div className="demo-column">
      <Select
        value={value}
        onChange={(v) => setValue(v as string)}
        options={options}
        placeholder={isZh ? '请选择城市' : 'Select a city'}
        clearable
      />
      <p className="demo-text">
        {isZh ? '当前选中' : 'Selected'}：{value || (isZh ? '（未选择）' : '(none)')}
      </p>
    </div>
  );
}
