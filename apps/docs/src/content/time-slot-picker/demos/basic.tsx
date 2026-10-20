import { useState } from 'react';
import { TimeSlotPicker, Button } from '@xui-design/react';
import type { TimeSlotGranularity } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

const options: { key: TimeSlotGranularity; zh: string; en: string }[] = [
  { key: 'day', zh: '按日', en: 'Day' },
  { key: 'week', zh: '按周', en: 'Week' },
  { key: 'month', zh: '按月', en: 'Month' },
  { key: 'year', zh: '按年', en: 'Year' },
];

export default function TimeSlotPickerBasicDemo() {
  const isZh = useIsZh();
  const [granularity, setGranularity] = useState<TimeSlotGranularity>('week');
  const [value, setValue] = useState<string[]>(['w:1:09', 'w:1:10', 'w:2:14', 'w:3:19']);

  const switchGranularity = (key: TimeSlotGranularity) => {
    setGranularity(key);
    setValue([]);
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        {options.map((option) => (
          <Button
            key={option.key}
            size="sm"
            type={granularity === option.key ? 'primary' : 'default'}
            onClick={() => switchGranularity(option.key)}
          >
            {isZh ? option.zh : option.en}
          </Button>
        ))}
      </div>
      <TimeSlotPicker
        value={value}
        onChange={setValue}
        granularity={granularity}
        referenceDate="2026-10-20"
      />
      <span className="demo-text">
        {isZh ? `已选择 ${value.length} 个时段` : `${value.length} slots selected`}
      </span>
    </div>
  );
}
