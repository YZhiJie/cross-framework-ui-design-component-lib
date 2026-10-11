import { useState } from 'react';
import { Spin, Button } from '@xui/react';

export default function SpinWrapperDemo() {
  const [spinning, setSpinning] = useState(true);

  return (
    <div className="demo-column">
      <Spin spinning={spinning} tip="数据加载中">
        <div
          style={{
            padding: 16,
            background: '#f8fafc',
            borderRadius: 8,
          }}
        >
          <h4 style={{ margin: '0 0 8px' }}>被包裹的内容区</h4>
          <p style={{ margin: 0, color: '#6b7280' }}>
            spinning 为 true 时覆盖半透明遮罩，false 时内容正常交互。
          </p>
        </div>
      </Spin>
      <Button size="sm" onClick={() => setSpinning((v) => !v)}>
        {spinning ? '停止加载' : '开始加载'}
      </Button>
    </div>
  );
}
