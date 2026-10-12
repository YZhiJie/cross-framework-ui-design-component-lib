import { useRef } from 'react';
import { Tooltip, Popconfirm, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function FloatingFlipDemo() {
  const isZh = useIsZh();
  const topAnchor = useRef<HTMLDivElement>(null);
  const bottomAnchor = useRef<HTMLDivElement>(null);

  const scrollToTopEdge = () => {
    const el = topAnchor.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - 12, behavior: 'smooth' });
  };

  const scrollToBottomEdge = () => {
    const el = bottomAnchor.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + rect.top - window.innerHeight + rect.height + 12,
      behavior: 'smooth',
    });
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={scrollToTopEdge}>
          {isZh ? '滚动到视口顶部' : 'Scroll to viewport top'}
        </Button>
        <Button onClick={scrollToBottomEdge}>
          {isZh ? '滚动到视口底部' : 'Scroll to viewport bottom'}
        </Button>
      </div>
      <p
        style={{
          color: 'var(--docs-text-secondary, #888)',
          fontSize: '13px',
          margin: '8px 0 16px',
        }}
      >
        {isZh
          ? '点击按钮将触发元素定位到视口边缘，再悬停 / 点击组件观察气泡自动翻转。'
          : 'Click a button to position the element at the viewport edge, then hover / click the component to see the popover auto-flip.'}
      </p>
      <div ref={topAnchor} className="demo-row" style={{ padding: '8px 0' }}>
        <Tooltip
          content={isZh ? '上方空间不足 → 翻转到下方' : 'Not enough space above → flip down'}
          placement="top"
        >
          <Button>{isZh ? 'Tooltip top（近顶部）' : 'Tooltip top (near top)'}</Button>
        </Tooltip>
        <Popconfirm
          content={isZh ? '确认删除此条记录？' : 'Confirm delete this record?'}
          placement="top"
          confirmText={isZh ? '删除' : 'Delete'}
          cancelText={isZh ? '取消' : 'Cancel'}
        >
          <Button type="danger">Popconfirm top</Button>
        </Popconfirm>
      </div>
      <div style={{ height: '50vh' }} />
      <div ref={bottomAnchor} className="demo-row" style={{ padding: '8px 0' }}>
        <Tooltip
          content={isZh ? '下方空间不足 → 翻转到上方' : 'Not enough space below → flip up'}
          placement="bottom"
        >
          <Button>{isZh ? 'Tooltip bottom（近底部）' : 'Tooltip bottom (near bottom)'}</Button>
        </Tooltip>
        <Popconfirm
          content={isZh ? '底部确认提交？' : 'Confirm submit at bottom?'}
          placement="bottom"
          confirmText={isZh ? '提交' : 'Submit'}
          cancelText={isZh ? '取消' : 'Cancel'}
        >
          <Button type="primary">Popconfirm bottom</Button>
        </Popconfirm>
      </div>
    </div>
  );
}
