import { useState } from 'react';
import { Switch } from '@xui/react';

export default function SwitchTextDemo() {
  const [value, setValue] = useState(true);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Switch value={value} onChange={setValue} checkedText="开启" uncheckedText="关闭" />
        <Switch defaultValue checkedText="ON" uncheckedText="OFF" />
        <Switch size="sm" defaultValue checkedText="是" uncheckedText="否" />
      </div>
      <div className="demo-row">
        <Switch defaultValue checkedText="启用超长文本展示" uncheckedText="禁用超长文本展示" />
      </div>
    </div>
  );
}
