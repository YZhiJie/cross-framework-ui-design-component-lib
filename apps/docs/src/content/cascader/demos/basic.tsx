import { useState } from 'react';
import { Cascader } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

const options = [
  {
    label: '华东',
    value: 'east',
    children: [
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
  {
    label: '华北',
    value: 'north',
    children: [
      { label: '北京', value: 'beijing' },
      { label: '天津', value: 'tianjin', disabled: true },
    ],
  },
];

export default function CascaderBasicDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="demo-column">
      <Cascader
        value={value}
        onChange={(v) => setValue(v as string[])}
        options={options}
        clearable
      />
      <p className="demo-text">
        {isZh ? `选中值：${JSON.stringify(value)}` : `Value: ${JSON.stringify(value)}`}
      </p>
    </div>
  );
}
