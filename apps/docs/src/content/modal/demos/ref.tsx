import { useRef } from 'react';
import { Button, Modal } from '@xui/react';
import type { ModalRef } from '@xui/react';

export default function ModalRefDemo() {
  const modalRef = useRef<ModalRef>(null);

  return (
    <div className="demo-column">
      <Button onClick={() => modalRef.current?.open()}>通过 ref 打开</Button>
      <Modal ref={modalRef} title="命令式控制" width="420px">
        <p>不需要维护 visible 状态，直接调用实例方法 open() / close()。</p>
      </Modal>
    </div>
  );
}
