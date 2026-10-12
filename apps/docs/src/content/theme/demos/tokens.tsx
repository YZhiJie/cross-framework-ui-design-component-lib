import { useState } from 'react';
import { Button, clearThemeTokens, setThemeTokens, Switch, Tag } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

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

const PRESET_LABELS: Record<string, { zh: string; en: string }> = {
  emerald: { zh: '翡翠绿', en: 'Emerald' },
  amber: { zh: '琥珀橙', en: 'Amber' },
  rose: { zh: '玫红', en: 'Rose' },
};

export default function ThemeTokensDemo() {
  const isZh = useIsZh();
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="demo-column">
      <div className="demo-row">
        {Object.keys(PRESETS).map((name) => (
          <Button key={name} onClick={() => setThemeTokens(PRESETS[name])}>
            {isZh ? PRESET_LABELS[name].zh : PRESET_LABELS[name].en}
          </Button>
        ))}
        <Button type="link" onClick={() => clearThemeTokens()}>
          {isZh ? '恢复默认品牌色' : 'Reset to default brand color'}
        </Button>
      </div>
      <div className="demo-row">
        <Button type="primary">{isZh ? '主色按钮' : 'Primary button'}</Button>
        <Tag type="primary">{isZh ? '主色标签' : 'Primary tag'}</Tag>
        <Switch value={enabled} onChange={setEnabled} />
      </div>
    </div>
  );
}
