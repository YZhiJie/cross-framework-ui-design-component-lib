import { useState } from 'react';
import { TimePicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TimePickerBasicDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('');

  return (
    <div className="demo-column">
      <TimePicker value={value} onChange={setValue} clearable />
      <p className="demo-text">
        {isZh ? `选中时间：${value || '（未选择）'}` : `Selected: ${value || '(none)'}`}
      </p>
    </div>
  );
}
