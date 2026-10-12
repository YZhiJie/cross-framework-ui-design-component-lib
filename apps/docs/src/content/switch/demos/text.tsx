import { useState } from 'react';
import { Switch } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SwitchTextDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState(true);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Switch
          value={value}
          onChange={setValue}
          checkedText={isZh ? '开启' : 'On'}
          uncheckedText={isZh ? '关闭' : 'Off'}
        />
        <Switch defaultValue checkedText="ON" uncheckedText="OFF" />
        <Switch
          size="sm"
          defaultValue
          checkedText={isZh ? '是' : 'Yes'}
          uncheckedText={isZh ? '否' : 'No'}
        />
      </div>
      <div className="demo-row">
        <Switch
          defaultValue
          checkedText={isZh ? '启用超长文本展示' : 'Enabled long text'}
          uncheckedText={isZh ? '禁用超长文本展示' : 'Disabled long text'}
        />
      </div>
    </div>
  );
}
