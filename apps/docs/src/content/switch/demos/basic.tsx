import { useState } from 'react';
import { Switch } from '@xui/react';

export default function SwitchBasicDemo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="demo-row">
      <Switch value={enabled} onChange={setEnabled} />
      <span className="demo-text">当前值：{enabled ? '开启' : '关闭'}</span>
    </div>
  );
}
