import { Tag } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TagBasicDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-row">
      <Tag>{isZh ? '默认' : 'Default'}</Tag>
      <Tag type="primary">{isZh ? '主要' : 'Primary'}</Tag>
      <Tag type="success">{isZh ? '成功' : 'Success'}</Tag>
      <Tag type="warning">{isZh ? '警告' : 'Warning'}</Tag>
      <Tag type="danger">{isZh ? '危险' : 'Danger'}</Tag>
    </div>
  );
}
