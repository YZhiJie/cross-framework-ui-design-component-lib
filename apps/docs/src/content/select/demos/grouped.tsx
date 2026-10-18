import { useState } from 'react';
import { Select } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SelectGroupedDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('');

  const options = [
    {
      label: isZh ? '一线城市' : 'Tier-1 Cities',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
      ],
    },
    {
      label: isZh ? '新一线城市' : 'New Tier-1 Cities',
      options: [
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
        { label: '武汉', value: 'wuhan', disabled: true },
      ],
    },
  ];

  return (
    <div className="demo-column">
      <Select value={value} onChange={(v) => setValue(v as string)} options={options} clearable />
      <p className="demo-text">
        {isZh ? `选中值：${value || '（未选择）'}` : `Value: ${value || '(none)'}`}
      </p>
    </div>
  );
}
