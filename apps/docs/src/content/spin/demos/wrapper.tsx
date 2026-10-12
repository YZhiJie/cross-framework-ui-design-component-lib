import { useState } from 'react';
import { Spin, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SpinWrapperDemo() {
  const isZh = useIsZh();
  const [spinning, setSpinning] = useState(true);

  return (
    <div className="demo-column">
      <Spin spinning={spinning} tip={isZh ? '数据加载中' : 'Loading data'}>
        <div
          style={{
            padding: 16,
            background: '#f8fafc',
            borderRadius: 8,
          }}
        >
          <h4 style={{ margin: '0 0 8px' }}>{isZh ? '被包裹的内容区' : 'Wrapped content area'}</h4>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {isZh
              ? 'spinning 为 true 时覆盖半透明遮罩，false 时内容正常交互。'
              : 'When spinning is true, a semi-transparent overlay covers the content; when false, the content is fully interactive.'}
          </p>
        </div>
      </Spin>
      <Button size="sm" onClick={() => setSpinning((v) => !v)}>
        {spinning ? (isZh ? '停止加载' : 'Stop loading') : isZh ? '开始加载' : 'Start loading'}
      </Button>
    </div>
  );
}
