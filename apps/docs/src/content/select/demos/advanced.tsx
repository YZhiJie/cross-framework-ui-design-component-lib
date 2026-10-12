import { useState } from 'react';
import { Select } from '@xui-design/react';
import type { SelectOption, SelectValue } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SelectAdvancedDemo() {
  const isZh = useIsZh();
  const [cities, setCities] = useState<string[]>(['beijing']);
  const [searched, setSearched] = useState('');
  const [virtualValue, setVirtualValue] = useState('');
  const basicOptions: SelectOption[] = [
    { label: isZh ? '北京' : 'Beijing', value: 'beijing' },
    { label: isZh ? '上海' : 'Shanghai', value: 'shanghai' },
    { label: isZh ? '广州' : 'Guangzhou', value: 'guangzhou' },
    { label: isZh ? '深圳' : 'Shenzhen', value: 'shenzhen' },
  ];
  const bigOptions: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
    label: isZh ? `选项 ${i + 1}` : `Option ${i + 1}`,
    value: `opt-${i + 1}`,
  }));

  return (
    <div className="demo-column">
      <Select
        value={cities}
        onChange={(v: SelectValue) => setCities(Array.isArray(v) ? v : [v])}
        options={basicOptions}
        multiple
        placeholder={isZh ? '多选城市' : 'Multi-select cities'}
      />
      <p className="demo-text">
        {isZh ? '多选已选' : 'Multi-selected'}：
        {cities.join(isZh ? '、' : ', ') || (isZh ? '（无）' : '(none)')}
      </p>

      <Select
        value={searched}
        onChange={(v: SelectValue) => setSearched(v as string)}
        options={basicOptions}
        searchable
        clearable
        placeholder={isZh ? '输入关键字过滤' : 'Type a keyword to filter'}
      />
      <p className="demo-text">
        {isZh ? '可搜索当前选中' : 'Searchable selected'}：
        {searched || (isZh ? '（未选择）' : '(none)')}
      </p>

      <Select
        value={virtualValue}
        onChange={(v: SelectValue) => setVirtualValue(v as string)}
        options={bigOptions}
        virtual
        maxHeight={200}
        placeholder={isZh ? '虚拟滚动 · 1000 项' : 'Virtual scroll · 1000 items'}
      />
      <p className="demo-text">
        {isZh ? '虚拟滚动当前选中' : 'Virtual scroll selected'}：
        {virtualValue || (isZh ? '（未选择）' : '(none)')}
      </p>
    </div>
  );
}
