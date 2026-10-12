import type { CSSProperties } from 'react';
import { Button, Switch } from '@xui/react';

export default function ThemeScopedDemo() {
  return (
    <div className="demo-column">
      <p className="demo-text">在组件 style 上写 CSS 变量即可覆盖主题，仅作用于该组件子树：</p>
      <div
        className="demo-row"
        style={
          {
            '--xui-color-primary': '#7c3aed',
            '--xui-color-primary-hover': '#6d28d9',
            '--xui-color-primary-active': '#5b21b6',
          } as CSSProperties
        }
      >
        <Button type="primary">紫色子树</Button>
        <Switch value />
      </div>
      <div className="demo-row" style={{ '--xui-color-danger': '#0ea5e9' } as CSSProperties}>
        <Button type="danger">danger 覆盖为天蓝</Button>
        <Button type="primary">不受影响</Button>
      </div>
    </div>
  );
}
