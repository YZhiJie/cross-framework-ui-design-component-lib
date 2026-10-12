import { useState } from 'react';
import { InputNumber } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function InputNumberBasicDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState<number | null>(3.5);

  return (
    <div className="demo-column">
      <InputNumber value={value} onChange={setValue} min={0} max={10} step={0.5} precision={2} />
      <p className="demo-text">
        {isZh
          ? `当前值：${value}（范围 0 - 10，步长 0.5，保留 2 位小数）`
          : `Current: ${value} (range 0-10, step 0.5, 2 decimals)`}
      </p>
    </div>
  );
}
