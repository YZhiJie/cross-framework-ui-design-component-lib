import { Alert } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function AlertClosableDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <Alert
        type="warning"
        showIcon
        closable
        renderTitle={() => <strong>{isZh ? '可关闭且带图标' : 'Closable with icon'}</strong>}
      >
        {isZh
          ? '描述内容通过 children 传入，支持更灵活的排版。'
          : 'Description content is passed via children, allowing flexible layout.'}
      </Alert>
    </div>
  );
}
