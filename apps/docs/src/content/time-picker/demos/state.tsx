import { useState } from 'react';
import { TimePicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TimePickerStateDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState('09:30');

  return (
    <div className="demo-column">
      <TimePicker
        value={value}
        onChange={setValue}
        format="HH:mm"
        hourStep={2}
        minuteStep={10}
        clearable
      />
      <p className="demo-text">
        {isZh
          ? `format="HH:mm" 仅显示时分；hourStep=2，minuteStep=10`
          : `format="HH:mm" shows hours & minutes only; hourStep=2, minuteStep=10`}
      </p>
    </div>
  );
}
