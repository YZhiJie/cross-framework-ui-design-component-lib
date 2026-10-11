import { Alert } from '@xui/react';

export default function AlertClosableDemo() {
  return (
    <div className="demo-column">
      <Alert type="warning" showIcon closable renderTitle={() => <strong>可关闭且带图标</strong>}>
        描述内容通过 children 传入，支持更灵活的排版。
      </Alert>
    </div>
  );
}
