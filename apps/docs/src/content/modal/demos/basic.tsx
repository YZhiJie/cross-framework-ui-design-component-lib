import { useState } from 'react';
import { Button, Modal } from '@xui-design/react';

export default function ModalBasicDemo() {
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);

  return (
    <div className="demo-column">
      <Button type="primary" onClick={() => setVisible(true)}>
        打开对话框
      </Button>
      <Modal
        visible={visible}
        title="操作确认"
        onOk={close}
        onCancel={close}
        renderFooter={() => (
          <>
            <Button onClick={close}>取消</Button>
            <Button type="primary" onClick={close}>
              确认
            </Button>
          </>
        )}
      >
        <p>这是一段对话框内容，确认后将执行对应操作。</p>
      </Modal>
    </div>
  );
}
