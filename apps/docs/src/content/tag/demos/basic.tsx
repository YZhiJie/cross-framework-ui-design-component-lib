import { Tag } from '@xui/react';

export default function TagBasicDemo() {
  return (
    <div className="demo-row">
      <Tag>默认</Tag>
      <Tag type="primary">主要</Tag>
      <Tag type="success">成功</Tag>
      <Tag type="warning">警告</Tag>
      <Tag type="danger">危险</Tag>
    </div>
  );
}
