import { Spin } from '@xui/react';

export default function SpinBasicDemo() {
  return (
    <div className="demo-row">
      <Spin size="sm" />
      <Spin />
      <Spin size="lg" />
      <Spin size="lg" tip="加载中..." />
    </div>
  );
}
