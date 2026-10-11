import { useState } from 'react';
import { Popconfirm, Button } from '@xui/react';

export default function PopconfirmBasicDemo() {
  const [result, setResult] = useState('（待操作）');

  return (
    <div className="demo-column">
      <Popconfirm
        content="确定要删除这条记录吗？删除后不可恢复。"
        onConfirm={() => setResult('已确认删除')}
        onCancel={() => setResult('已取消')}
      >
        <Button type="danger">删除记录</Button>
      </Popconfirm>
      <p className="demo-text">操作结果：{result}</p>
    </div>
  );
}
