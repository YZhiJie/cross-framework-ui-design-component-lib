import { Switch } from '@xui-design/react';

export default function SwitchStateDemo() {
  return (
    <div className="demo-row">
      <Switch defaultValue size="sm" />
      <Switch defaultValue />
      <Switch disabled />
      <Switch loading />
    </div>
  );
}
