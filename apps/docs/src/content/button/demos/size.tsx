import { Button } from '@xui/react';

export default function ButtonSizeDemo() {
  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <Button block>Block（宽度撑满容器）</Button>
    </div>
  );
}
