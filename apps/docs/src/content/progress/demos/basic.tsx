import { useState } from 'react';
import { Button, Progress } from '@xui-design/react';

export default function ProgressBasicDemo() {
  const [percent, setPercent] = useState(35);
  const add = (delta: number) => {
    setPercent((prev) => Math.min(100, Math.max(0, prev + delta)));
  };

  return (
    <div className="demo-column">
      <Progress percent={percent} />
      <Progress type="circle" percent={percent} strokeWidth={8} />
      <div className="demo-row">
        <Button size="sm" onClick={() => add(-10)}>
          -10%
        </Button>
        <Button size="sm" type="primary" onClick={() => add(10)}>
          +10%
        </Button>
      </div>
    </div>
  );
}
