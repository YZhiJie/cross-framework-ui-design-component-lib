import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Waterfall } from '../Waterfall';

afterEach(() => {
  cleanup();
});

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i, title: `item-${i}` }));
}

describe('Waterfall (react)', () => {
  it('基础渲染：传入 items 正确分多列', () => {
    const { container } = render(<Waterfall items={makeItems(6)} columns={3} />);

    expect(container.querySelector('.xui-waterfall')).not.toBeNull();
    expect(container.querySelectorAll('.xui-waterfall__column')).toHaveLength(3);
    expect(container.querySelectorAll('.xui-waterfall__item')).toHaveLength(6);
  });

  it('空数据态渲染空结构', () => {
    const { container } = render(<Waterfall items={[]} columns={2} />);
    expect(container.querySelector('.xui-waterfall--empty')).not.toBeNull();
  });

  it('item 点击 → onItemClick 回调', () => {
    const onItemClick = vi.fn();
    const { container } = render(
      <Waterfall items={makeItems(4)} columns={2} onItemClick={onItemClick} />,
    );

    const item = container.querySelector('.xui-waterfall__item') as HTMLElement;
    expect(item).not.toBeNull();
    fireEvent.click(item);

    expect(onItemClick).toHaveBeenCalledTimes(1);
    const [arg] = onItemClick.mock.calls[0];
    expect(arg.id).toBeDefined();
  });

  it('columns prop 变化 → 列数变化', () => {
    const { container, rerender } = render(<Waterfall items={makeItems(6)} columns={2} />);
    expect(container.querySelectorAll('.xui-waterfall__column')).toHaveLength(2);

    rerender(<Waterfall items={makeItems(6)} columns={3} />);
    // 注意 rerender 时 React 会更新同一容器
    expect(container.querySelectorAll('.xui-waterfall__column')).toHaveLength(3);
  });

  it('自定义 rowKey', () => {
    const { container } = render(
      <Waterfall items={[{ uid: 'a' }, { uid: 'b' }]} rowKey="uid" columns={2} />,
    );
    expect(container.querySelectorAll('.xui-waterfall__item')).toHaveLength(2);
  });

  it('onLayoutChange 在 mount 时触发', () => {
    const onLayoutChange = vi.fn();
    render(<Waterfall items={makeItems(4)} columns={2} onLayoutChange={onLayoutChange} />);

    // jsdom 无 ResizeObserver → 逻辑层在 create 时已触发 layout + 回调
    expect(onLayoutChange).toHaveBeenCalledWith(
      expect.objectContaining({
        columnCount: 2,
        columnHeights: expect.any(Array),
      }),
    );
  });
});
