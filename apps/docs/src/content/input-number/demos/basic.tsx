import { useState } from 'react';
import { InputNumber } from '@xui/react';

export default function InputNumberBasicDemo() {
  const [value, setValue] = useState<number | null>(3.5);

  return (
    <div className="demo-column">
      <InputNumber value={value} onChange={setValue} min={0} max={10} step={0.5} precision={2} />
      <p className="demo-text">当前值：{value}（范围 0 - 10，步长 0.5，保留 2 位小数）</p>
    </div>
  );
}
