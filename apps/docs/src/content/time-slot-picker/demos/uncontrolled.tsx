import { useState } from 'react';
import { TimeSlotPicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TimeSlotPickerUncontrolledDemo() {
  const isZh = useIsZh();
  const [latest, setLatest] = useState<string[]>([]);

  return (
    <div className="demo-column">
      <TimeSlotPicker
        defaultValue={['h:09', 'h:10', 'h:18']}
        granularity="day"
        showFooter={false}
        onChange={setLatest}
      />
      <span className="demo-text">
        {isZh ? 'onChange：' : 'onChange: '}
        {latest.length ? latest.join(', ') : '—'}
      </span>
    </div>
  );
}
