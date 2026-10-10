import { useRef, useState } from 'react';
import { Button, Input, Modal } from '@xui/react';
import type { ModalRef } from '@xui/react';
import '@xui/styles';

export default function App() {
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const modalRef = useRef<ModalRef>(null);

  const pushLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
  };

  return (
    <div className="playground">
      <h1>XUI - React Playground</h1>
      <p className="subtitle">跨框架组件库 · React 19 适配层集成验证</p>

      <section>
        <h2>Button</h2>
        <div className="row">
          <Button>default</Button>
          <Button type="primary">primary</Button>
          <Button type="danger">danger</Button>
          <Button type="link">link</Button>
        </div>
        <div className="row">
          <Button size="sm">small</Button>
          <Button size="md">medium</Button>
          <Button size="lg">large</Button>
        </div>
        <div className="row">
          <Button disabled>disabled</Button>
          <Button loading>loading</Button>
          <Button block>block (full width)</Button>
        </div>
        <div className="row">
          <Button type="primary" onClick={() => pushLog('button clicked')}>
            click me
          </Button>
          <Button onClick={() => setVisible(true)}>open modal</Button>
        </div>
      </section>

      <section>
        <h2>Input</h2>
        <div className="row">
          <Input
            value={name}
            placeholder="type something..."
            clearable
            onInput={(v) => {
              setName(v);
              pushLog(`input: ${v}`);
            }}
            onChange={(v) => pushLog(`change: ${v}`)}
            onClear={() => pushLog('cleared')}
          />
        </div>
        <div className="row">
          <Input value="disabled" disabled />
          <Input value="readonly" readonly />
          <Input placeholder="with prefix" renderPrefix={() => <span>🔍</span>} />
        </div>
      </section>

      <section>
        <h2>Modal</h2>
        <div className="row">
          <Button type="primary" onClick={() => setVisible(true)}>
            show modal
          </Button>
          <Button onClick={() => modalRef.current?.open()}>open via ref</Button>
        </div>
      </section>

      <Modal
        ref={modalRef}
        visible={visible}
        title="Hello XUI"
        width={480}
        closable
        maskClosable
        closeOnEsc
        onOpen={() => pushLog('modal open')}
        onClose={() => setVisible(false)}
        onOk={() => pushLog('modal ok')}
        onCancel={() => pushLog('modal cancel')}
        renderFooter={() => (
          <>
            <Button onClick={() => setVisible(false)}>cancel</Button>
            <Button type="primary" onClick={() => setVisible(false)}>
              confirm
            </Button>
          </>
        )}
      >
        <p>
          Modal content here. Value from input: <strong>{name || '(empty)'}</strong>
        </p>
      </Modal>

      <section>
        <h2>Event log</h2>
        <pre className="log">{log.join('\n') || '(no events yet)'}</pre>
      </section>
    </div>
  );
}
