import { useRef } from 'react';
import { Tooltip, Popconfirm, Select, Button } from '@xui/react';

const options = Array.from({ length: 1000 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: String(i + 1),
}));

export default function FloatingMultiDemo() {
  const anchor = useRef<HTMLDivElement>(null);

  const scrollToTopEdge = () => {
    const el = anchor.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - 12, behavior: 'smooth' });
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={scrollToTopEdge}>
          滚动到视口顶部
        </Button>
      </div>
      <p style={{ color: 'var(--docs-text-secondary, #888)', fontSize: '13px', margin: '8px 0 16px' }}>
        Tooltip / Popconfirm / Select 三组件共用 @xui/shared/floating 的翻转与钳制逻辑。滚动到视口顶部后操作各组件，观察气泡 / 面板自动翻转到下方。
      </p>
      <div ref={anchor} className="demo-row" style={{ padding: '8px 0', gap: '16px' }}>
        <Tooltip content="Tooltip 共用避让逻辑" placement="top">
          <Button>Tooltip</Button>
        </Tooltip>
        <Popconfirm content="Popconfirm 共用避让逻辑" placement="top" confirmText="确定" cancelText="取消">
          <Button type="primary">Popconfirm</Button>
        </Popconfirm>
        <Select options={options} virtual placeholder="Select（虚拟滚动）" style={{ width: '200px' }} />
      </div>
    </div>
  );
}
