import { useRef, useState } from 'react';
import { TimeSlotPicker, Button } from '@xui-design/react';
import type { TimeSlotPickerRef } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TimeSlotPickerActionsDemo() {
  const isZh = useIsZh();
  const pickerRef = useRef<TimeSlotPickerRef>(null);
  const [value, setValue] = useState<string[]>(['2026-10-01', '2026-10-02']);

  return (
    <div className="demo-column">
      <TimeSlotPicker
        ref={pickerRef}
        value={value}
        onChange={setValue}
        granularity="month"
        referenceDate="2026-10-20"
      />
      <div className="demo-row">
        <Button size="sm" onClick={() => pickerRef.current?.selectAll()}>
          {isZh ? '全选本月' : 'Select month'}
        </Button>
        <Button size="sm" onClick={() => pickerRef.current?.clear()}>
          {isZh ? '清空' : 'Clear'}
        </Button>
        <span className="demo-text">
          {isZh ? `已选择 ${value.length} 天` : `${value.length} days selected`}
        </span>
      </div>
    </div>
  );
}
