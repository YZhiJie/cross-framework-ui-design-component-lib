import { Empty, Button } from '@xui-design/react';

export default function EmptyBasicDemo() {
  return (
    <Empty description="暂无数据，去创建第一条吧">
      <Button type="primary">立即创建</Button>
    </Empty>
  );
}
