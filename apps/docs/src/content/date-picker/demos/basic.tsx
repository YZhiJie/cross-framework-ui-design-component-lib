import { useState } from 'react';
import { DatePicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function DatePickerBasicDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('2026-10-01');

  return (
    <div className="demo-column">
      <DatePicker value={value} onChange={setValue} clearable />
      <p className="demo-text">
        {isZh ? '当前日期' : 'Current date'}：{value || (isZh ? '（未选择）' : '(none)')}
      </p>
    </div>
  );
}
