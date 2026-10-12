import { useState } from 'react';
import { Badge, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function BadgeBasicDemo() {
  const isZh = useIsZh();
  const [count, setCount] = useState(5);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Badge count={count}>
          <Button>{isZh ? '消息' : 'Messages'}</Button>
        </Badge>
        <Badge count={120} max={99}>
          <Button>{isZh ? '通知' : 'Notifications'}</Button>
        </Badge>
      </div>
      <div className="demo-row">
        <Button size="sm" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          -1
        </Button>
        <Button size="sm" type="primary" onClick={() => setCount((c) => c + 1)}>
          {isZh ? '+1（试试超过 99）' : '+1 (try over 99)'}
        </Button>
      </div>
    </div>
  );
}
