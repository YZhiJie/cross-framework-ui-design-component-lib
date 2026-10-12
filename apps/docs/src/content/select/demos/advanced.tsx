import { useState } from 'react';
import { Select } from '@xui-design/react';
import type { SelectOption, SelectValue } from '@xui-design/core';

const basicOptions: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
];

const bigOptions: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: `opt-${i + 1}`,
}));

export default function SelectAdvancedDemo() {
  const [cities, setCities] = useState<string[]>(['beijing']);
  const [searched, setSearched] = useState('');
  const [virtualValue, setVirtualValue] = useState('');

  return (
    <div className="demo-column">
      <Select
        value={cities}
        onChange={(v: SelectValue) => setCities(Array.isArray(v) ? v : [v])}
        options={basicOptions}
        multiple
        placeholder="多选城市"
      />
      <p className="demo-text">多选已选：{cities.join('、') || '（无）'}</p>

      <Select
        value={searched}
        onChange={(v: SelectValue) => setSearched(v as string)}
        options={basicOptions}
        searchable
        clearable
        placeholder="输入关键字过滤"
      />
      <p className="demo-text">可搜索当前选中：{searched || '（未选择）'}</p>

      <Select
        value={virtualValue}
        onChange={(v: SelectValue) => setVirtualValue(v as string)}
        options={bigOptions}
        virtual
        maxHeight={200}
        placeholder="虚拟滚动 · 1000 项"
      />
      <p className="demo-text">虚拟滚动当前选中：{virtualValue || '（未选择）'}</p>
    </div>
  );
}
