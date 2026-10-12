import { useState } from 'react';
import { getTheme, setTheme, toggleTheme } from '@xui-design/react';
import { Alert, Button, Input, Switch, Tag } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ThemeDarkDemo() {
  const isZh = useIsZh();
  const [current, setCurrent] = useState(getTheme());
  const [enabled, setEnabled] = useState(true);
  const [text, setText] = useState(isZh ? '跟随主题的输入框' : 'Themed input');

  const apply = (theme: 'light' | 'dark') => {
    setTheme(theme);
    setCurrent(getTheme());
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={() => apply('dark')}>
          {isZh ? '切换为暗色' : 'Switch to Dark'}
        </Button>
        <Button onClick={() => apply('light')}>{isZh ? '切换为浅色' : 'Switch to Light'}</Button>
        <Button type="link" onClick={() => setCurrent(toggleTheme())}>
          {isZh ? '往返切换' : 'Toggle'}
        </Button>
        <Tag type={current === 'dark' ? 'warning' : 'primary'}>
          {isZh ? '当前' : 'Current'}：{current === 'dark' ? 'dark' : 'light'}
        </Tag>
      </div>
      <Alert
        type="info"
        title={isZh ? '全局主题' : 'Global Theme'}
        description={
          isZh
            ? 'Alert / Button / Input / Switch 等组件颜色全部随主题联动。'
            : 'Alert / Button / Input / Switch colors all follow the theme.'
        }
      />
      <div className="demo-row">
        <Input value={text} onInput={setText} style={{ width: '220px' }} />
        <Switch value={enabled} onChange={setEnabled} />
      </div>
    </div>
  );
}
