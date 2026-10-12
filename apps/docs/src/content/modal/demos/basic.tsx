import { useState } from 'react';
import { Button, Modal } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ModalBasicDemo() {
  const isZh = useIsZh();
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);

  return (
    <div className="demo-column">
      <Button type="primary" onClick={() => setVisible(true)}>
        {isZh ? '打开对话框' : 'Open modal'}
      </Button>
      <Modal
        visible={visible}
        title={isZh ? '操作确认' : 'Confirm action'}
        onOk={close}
        onCancel={close}
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
            ? '这是一段对话框内容，确认后将执行对应操作。'
            : 'Modal body text. Confirm to proceed with the action.'}
        </p>
      </Modal>
    </div>
  );
}
