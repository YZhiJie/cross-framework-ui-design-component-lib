import { useState } from 'react';
import { Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ButtonStateDemo() {
  const isZh = useIsZh();
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
        {loading
          ? isZh
            ? '提交中...'
            : 'Submitting...'
          : isZh
            ? '点击模拟提交'
            : 'Click to submit'}
      </Button>
    </div>
  );
}
