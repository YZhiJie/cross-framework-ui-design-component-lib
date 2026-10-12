import { useState } from 'react';
import { Button, Modal } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ModalCustomDemo() {
  const isZh = useIsZh();
  const [visible, setVisible] = useState(false);
  return (
    <div className="demo-column">
      <Button type="primary" onClick={() => setVisible(true)}>
        {isZh ? '打开对话框' : 'Open modal'}
      </Button>
      <Modal
        visible={visible}
        title={isZh ? '删除确认' : 'Delete confirmation'}
        okText={isZh ? '确认删除' : 'Confirm delete'}
        cancelText={isZh ? '再想想' : 'Maybe later'}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>
          {isZh
            ? '删除后不可恢复，请谨慎操作。底部按钮文案由 okText / cancelText 自定义。'
            : 'Deletion is irreversible, proceed with caution. Footer button text is customized via okText / cancelText.'}
        </p>
      </Modal>
    </div>
  );
}
