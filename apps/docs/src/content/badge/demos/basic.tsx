import { useState } from 'react';
import { Badge, Button } from '@xui/react';

export default function BadgeBasicDemo() {
  const [count, setCount] = useState(5);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Badge count={count}>
          <Button>消息</Button>
        </Badge>
        <Badge count={120} max={99}>
          <Button>通知</Button>
        </Badge>
      </div>
      <div className="demo-row">
        <Button size="sm" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          -1
        </Button>
        <Button size="sm" type="primary" onClick={() => setCount((c) => c + 1)}>
          +1（试试超过 99）
        </Button>
      </div>
    </div>
  );
}
