import { useState } from 'react';
import { DatePicker } from '@xui-design/react';

export default function DatePickerBasicDemo() {
  const [value, setValue] = useState('2026-10-01');

  return (
    <div className="demo-column">
      <DatePicker value={value} onChange={setValue} clearable />
      <p className="demo-text">当前日期：{value || '（未选择）'}</p>
    </div>
  );
}
