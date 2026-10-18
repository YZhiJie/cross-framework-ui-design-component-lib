import { useState } from 'react';
import { Dropdown, Button } from '@xui-design/react';
import type { DropdownOption } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function DropdownBasicDemo() {
  const isZh = useIsZh();
  const [result, setResult] = useState('(pending)');

  const menu: DropdownOption[] = [
    { key: 'profile', label: isZh ? '个人中心' : 'Profile', icon: 'user' },
    { key: 'schedule', label: isZh ? '我的日程' : 'My Schedule', icon: 'calendar' },
    { key: 'logout', label: isZh ? '退出登录' : 'Sign out', icon: 'close' },
  ];

  return (
    <div className="demo-column">
      <Dropdown
        menu={menu}
        onSelect={(key) => setResult(isZh ? `已选择：${key}` : `Selected: ${key}`)}
        onVisibleChange={(open) => {
          if (open) setResult(isZh ? '菜单已展开' : 'Menu opened');
        }}
      >
        <Button>{isZh ? '用户菜单' : 'User Menu'}</Button>
      </Dropdown>
      <p className="demo-text">{result}</p>
    </div>
  );
}
