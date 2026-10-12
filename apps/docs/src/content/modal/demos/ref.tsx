import { useRef } from 'react';
import { Button, Modal } from '@xui-design/react';
import type { ModalRef } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ModalRefDemo() {
  const isZh = useIsZh();
  const modalRef = useRef<ModalRef>(null);

  return (
    <div className="demo-column">
      <Button onClick={() => modalRef.current?.open()}>
        {isZh ? '通过 ref 打开' : 'Open via ref'}
      </Button>
      <Modal ref={modalRef} title={isZh ? '命令式控制' : 'Imperative control'} width="420px">
        <p>
          {isZh
            ? '不需要维护 visible 状态，直接调用实例方法 open() / close()。'
            : 'No need to manage visible state manually; call instance methods open() / close() directly.'}
        </p>
      </Modal>
    </div>
  );
}
