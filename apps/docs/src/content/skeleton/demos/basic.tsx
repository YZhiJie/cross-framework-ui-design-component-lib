import { useState } from 'react';
import { Skeleton, Button } from '@xui-design/react';

export default function SkeletonBasicDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="demo-column">
      <Skeleton loading={loading} rows={3}>
        <div>
          <h4 style={{ margin: '0 0 8px' }}>加载完成后的真实内容</h4>
          <p style={{ margin: 0, color: '#6b7280' }}>
            这是一段从服务端获取的数据，loading 为 false 时替换骨架屏渲染。
          </p>
        </div>
      </Skeleton>
      <Button size="sm" onClick={() => setLoading((v) => !v)}>
        {loading ? '加载完成' : '重新加载'}
      </Button>
    </div>
  );
}
