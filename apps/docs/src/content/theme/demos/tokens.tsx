import { useState } from 'react';
import { Button, clearThemeTokens, setThemeTokens, Switch, Tag } from '@xui/react';

const PRESETS: Record<string, Record<string, string>> = {
  emerald: {
    '--xui-color-primary': '#10b981',
    '--xui-color-primary-hover': '#059669',
    '--xui-color-primary-active': '#047857',
  },
  amber: {
    '--xui-color-primary': '#f59e0b',
    '--xui-color-primary-hover': '#d97706',
    '--xui-color-primary-active': '#b45309',
  },
  rose: {
    '--xui-color-primary': '#f43f5e',
    '--xui-color-primary-hover': '#e11d48',
    '--xui-color-primary-active': '#be123c',
  },
};

export default function ThemeTokensDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="demo-column">
      <div className="demo-row">
        {Object.keys(PRESETS).map((name) => (
          <Button key={name} onClick={() => setThemeTokens(PRESETS[name])}>
            {name === 'emerald' ? '翡翠绿' : name === 'amber' ? '琥珀橙' : '玫红'}
          </Button>
        ))}
        <Button type="link" onClick={() => clearThemeTokens()}>
          恢复默认品牌色
        </Button>
      </div>
      <div className="demo-row">
        <Button type="primary">主色按钮</Button>
        <Tag type="primary">主色标签</Tag>
        <Switch value={enabled} onChange={setEnabled} />
      </div>
    </div>
  );
}
