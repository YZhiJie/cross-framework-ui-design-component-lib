import { useState } from 'react';
import { Switch } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SwitchBasicDemo() {
  const isZh = useIsZh();
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="demo-row">
      <Switch value={enabled} onChange={setEnabled} />
      <span className="demo-text">
        {isZh ? '当前值：' : 'Current: '}
        {enabled ? (isZh ? '开启' : 'On') : isZh ? '关闭' : 'Off'}
      </span>
    </div>
  );
}
