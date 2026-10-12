import { useState } from 'react';
import { getTheme, setTheme, toggleTheme } from '@xui-design/react';
import { Alert, Button, Input, Switch, Tag } from '@xui-design/react';

export default function ThemeDarkDemo() {
  const [current, setCurrent] = useState(getTheme());
  const [enabled, setEnabled] = useState(true);
  const [text, setText] = useState('跟随主题的输入框');

  const apply = (theme: 'light' | 'dark') => {
    setTheme(theme);
    setCurrent(getTheme());
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={() => apply('dark')}>
          切换为暗色
        </Button>
        <Button onClick={() => apply('light')}>切换为浅色</Button>
        <Button type="link" onClick={() => setCurrent(toggleTheme())}>
          往返切换
        </Button>
        <Tag type={current === 'dark' ? 'warning' : 'primary'}>
          当前：{current === 'dark' ? 'dark' : 'light'}
        </Tag>
      </div>
      <Alert
        type="info"
        title="全局主题"
        description="Alert / Button / Input / Switch 等组件颜色全部随主题联动。"
      />
      <div className="demo-row">
        <Input value={text} onInput={setText} style={{ width: '220px' }} />
        <Switch value={enabled} onChange={setEnabled} />
      </div>
    </div>
  );
}
