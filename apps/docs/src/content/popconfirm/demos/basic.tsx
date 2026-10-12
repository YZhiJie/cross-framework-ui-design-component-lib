import { useState } from 'react';
import { Popconfirm, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function PopconfirmBasicDemo() {
  const isZh = useIsZh();
  const [result, setResult] = useState(isZh ? '（待操作）' : '(pending)');

  return (
    <div className="demo-column">
      <Popconfirm
        content={
          isZh
            ? '确定要删除这条记录吗？删除后不可恢复。'
            : 'Are you sure you want to delete this record? This cannot be undone.'
        }
        onConfirm={() => setResult(isZh ? '已确认删除' : 'Deletion confirmed')}
        onCancel={() => setResult(isZh ? '已取消' : 'Cancelled')}
      >
        <Button type="danger">{isZh ? '删除记录' : 'Delete record'}</Button>
      </Popconfirm>
      <p className="demo-text">
        {isZh ? '操作结果：' : 'Result: '}
        {result}
      </p>
    </div>
  );
}
