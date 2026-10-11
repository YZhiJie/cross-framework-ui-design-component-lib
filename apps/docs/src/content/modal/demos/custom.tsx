import { useState } from 'react';
import { Button, Modal } from '@xui/react';

export default function ModalCustomDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="demo-column">
      <Button type="primary" onClick={() => setVisible(true)}>
        打开对话框
      </Button>
      <Modal
        visible={visible}
        title="删除确认"
        okText="确认删除"
        cancelText="再想想"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>删除后不可恢复，请谨慎操作。底部按钮文案由 okText / cancelText 自定义。</p>
      </Modal>
    </div>
  );
}
