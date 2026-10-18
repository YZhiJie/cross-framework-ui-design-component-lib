import { useState } from 'react';
import { Cascader } from '@xui-design/react';

const options = [
  {
    label: '华东',
    value: 'east',
    children: [
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
      { label: '南京', value: 'nanjing' },
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

export default function CascaderMultipleDemo() {
  const [value, setValue] = useState<string[][]>([]);

  return (
    <div className="demo-column">
      <Cascader
        value={value}
        onChange={(v) => setValue(v as string[][])}
        options={options}
        multiple
        clearable
        placeholder="请选择（可多选）"
      />
      <p className="demo-text">已选路径：{JSON.stringify(value)}</p>
    </div>
  );
}
