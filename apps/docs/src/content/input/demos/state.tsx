import { Input } from '@xui-design/react';

export default function InputStateDemo() {
  return (
    <div className="demo-column">
      <Input value="禁用态" disabled />
      <Input value="只读态" readonly />
      <Input placeholder="带前缀内容" renderPrefix={() => <span>🔍</span>} />
    </div>
  );
}
