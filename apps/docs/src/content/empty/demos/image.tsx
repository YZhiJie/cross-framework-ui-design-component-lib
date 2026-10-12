import { Empty } from '@xui-design/react';

export default function EmptyImageDemo() {
  return (
    <div className="demo-column">
      <Empty
        description="自定义插画"
        renderImage={() => <span style={{ fontSize: 40 }}>🔍</span>}
      />
      <Empty />
    </div>
  );
}
