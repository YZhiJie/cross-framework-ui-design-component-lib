import { Select } from '@xui-design/react';

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
];

export default function SelectStateDemo() {
  return (
    <div className="demo-column">
      <Select options={options} defaultValue="1" />
      <Select options={options} defaultValue="1" disabled />
    </div>
  );
}
