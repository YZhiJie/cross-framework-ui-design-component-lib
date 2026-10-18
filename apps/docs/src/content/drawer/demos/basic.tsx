import { useState } from 'react';
import { Button, Drawer } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function DrawerBasicDemo() {
  const isZh = useIsZh();
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);

  return (
    <div className="demo-column">
      <Button type="primary" onClick={() => setVisible(true)}>
        {isZh ? '打开抽屉' : 'Open drawer'}
      </Button>
      <Drawer
        visible={visible}
        title={isZh ? '编辑资料' : 'Edit profile'}
        onClose={close}
        renderFooter={() => (
          <>
            <Button onClick={close}>{isZh ? '取消' : 'Cancel'}</Button>
            <Button type="primary" onClick={close}>
              {isZh ? '确认' : 'Confirm'}
            </Button>
          </>
        )}
      >
        <p>
          {isZh
            ? '这是一段抽屉内容，可承载表单或详情信息。'
            : 'Drawer body text. Use it for forms or detail information.'}
        </p>
      </Drawer>
    </div>
  );
}
