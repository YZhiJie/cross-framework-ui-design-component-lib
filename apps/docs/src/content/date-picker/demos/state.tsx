import { DatePicker } from '@xui-design/react';

export default function DatePickerStateDemo() {
  return (
    <div className="demo-column">
      <DatePicker defaultValue="2026-01-15" placeholder="选择日期" />
      <DatePicker defaultValue="2026-01-15" disabled />
    </div>
  );
}
