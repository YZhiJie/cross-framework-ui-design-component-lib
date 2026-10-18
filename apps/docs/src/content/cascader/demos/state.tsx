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
      { label: '天津', value: 'tianjin' },
    ],
  },
];

export default function CascaderStateDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState<string[]>(['east', 'hangzhou']);

  return (
    <div className="demo-column">
      <Cascader
        value={value}
        onChange={(v) => setValue(v as string[])}
        options={options}
        changeOnSelect
        separator=" > "
        placeholder="选择任意层级"
      />
      <p className="demo-text">
        {isZh
          ? `changeOnSelect：选中任意层级即触发，分隔符为 " > "`
          : `changeOnSelect: select any level to trigger, separator " > "`}
      </p>
    </div>
  );
}
