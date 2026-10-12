import { Progress } from '@xui-design/react';

export default function ProgressStatusDemo() {
  return (
    <div className="demo-column">
      <Progress percent={100} />
      <Progress percent={100} status="error" />
      <Progress percent={60} />
    </div>
  );
}
