import { InputNumber } from '@xui-design/react';

export default function InputNumberStateDemo() {
  return (
    <div className="demo-column">
      <InputNumber defaultValue={3} min={1} max={5} placeholder="非受控，1 - 5" />
      <InputNumber defaultValue={8} disabled placeholder="禁用态" />
    </div>
  );
}
