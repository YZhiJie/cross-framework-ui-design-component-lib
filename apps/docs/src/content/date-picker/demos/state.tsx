import { DatePicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function DatePickerStateDemo() {
  const isZh = useIsZh();

  return (
    <div className="demo-column">
      <DatePicker defaultValue="2026-01-15" placeholder={isZh ? '选择日期' : 'Select a date'} />
      <DatePicker defaultValue="2026-01-15" disabled />
    </div>
  );
}
