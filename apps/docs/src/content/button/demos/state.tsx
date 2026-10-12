import { useState } from 'react';
import { Button } from '@xui-design/react';

export default function ButtonStateDemo() {
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="demo-row">
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button type="primary" loading={loading} onClick={submit}>
        {loading ? '提交中...' : '点击模拟提交'}
      </Button>
    </div>
  );
}
