import { useRef } from 'react';
import { Button, Drawer } from '@xui-design/react';
import type { DrawerRef } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function DrawerRefDemo() {
  const isZh = useIsZh();
  const drawerRef = useRef<DrawerRef>(null);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={() => drawerRef.current?.open()}>
          {isZh ? 'ref 打开' : 'Open via ref'}
        </Button>
        <Button onClick={() => drawerRef.current?.toggle()}>{isZh ? '切换' : 'Toggle'}</Button>
      </div>
      <Drawer
        ref={drawerRef}
        title={isZh ? '命令式抽屉' : 'Imperative drawer'}
        renderFooter={() => (
          <Button type="primary" onClick={() => drawerRef.current?.close()}>
            {isZh ? '关闭' : 'Close'}
          </Button>
        )}
      >
        <p>
          {isZh
            ? '无需维护 visible，直接调用实例 open() / close() / toggle()。'
            : 'No need to maintain visible; call open() / close() / toggle() on the instance.'}
        </p>
      </Drawer>
    </div>
  );
}
