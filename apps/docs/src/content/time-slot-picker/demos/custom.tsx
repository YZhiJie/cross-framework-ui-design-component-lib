import { useState } from 'react';
import { Button, TimeSlotPicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

// 组件级 CSS 变量：仅作用于当前实例
const pickerStyle: Record<string, string> = {
  '--xui-time-slot-size': '28px',
  '--xui-time-slot-gap': '5px',
  '--xui-color-primary': '#0ea5e9',
};

export default function TimeSlotPickerCustomDemo() {
  const isZh = useIsZh();
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState<string[]>(['w:3:10', 'w:3:11', 'w:4:15']);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button size="sm" onClick={() => setDisabled((prev) => !prev)}>
          {disabled ? (isZh ? '启用' : 'Enable') : isZh ? '禁用' : 'Disable'}
        </Button>
      </div>
      <TimeSlotPicker
        value={value}
        onChange={setValue}
        granularity="week"
        disabled={disabled}
        style={pickerStyle}
      />
    </div>
  );
}
