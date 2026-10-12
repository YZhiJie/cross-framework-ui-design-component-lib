import { useState } from 'react';
import { Skeleton, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SkeletonBasicDemo() {
  const isZh = useIsZh();
  const [loading, setLoading] = useState(true);

  return (
    <div className="demo-column">
      <Skeleton loading={loading} rows={3}>
        <div>
          <h4 style={{ margin: '0 0 8px' }}>
            {isZh ? '加载完成后的真实内容' : 'Real content after loading'}
          </h4>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {isZh
              ? '这是一段从服务端获取的数据，loading 为 false 时替换骨架屏渲染。'
              : 'This is data fetched from the server; skeleton is replaced when loading is false.'}
          </p>
        </div>
      </Skeleton>
      <Button size="sm" onClick={() => setLoading((v) => !v)}>
        {isZh ? (loading ? '加载完成' : '重新加载') : loading ? 'Finish loading' : 'Reload'}
      </Button>
    </div>
  );
}
