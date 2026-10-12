import type { CSSProperties } from 'react';
import { Button, Switch } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ThemeScopedDemo() {
  const isZh = useIsZh();

  return (
    <div className="demo-column">
      <p className="demo-text">
        {isZh
          ? '在组件 style 上写 CSS 变量即可覆盖主题，仅作用于该组件子树：'
          : 'Write CSS variables in the component style to override the theme, scoped to that component subtree only:'}
      </p>
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
        <Button type="primary">{isZh ? '紫色子树' : 'Purple subtree'}</Button>
        <Switch value />
      </div>
      <div className="demo-row" style={{ '--xui-color-danger': '#0ea5e9' } as CSSProperties}>
        <Button type="danger">
          {isZh ? 'danger 覆盖为天蓝' : 'danger overridden to sky blue'}
        </Button>
        <Button type="primary">{isZh ? '不受影响' : 'Unaffected'}</Button>
      </div>
    </div>
  );
}
