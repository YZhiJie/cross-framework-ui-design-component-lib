import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { Steps } from '../Steps';
import type { StepItem } from '@xui-design/core';

const items: StepItem[] = [
  { key: 'a', title: '第一步', description: '填写信息' },
  { key: 'b', title: '第二步', disabled: true },
  { key: 'c', title: '第三步' },
  { key: 'd', title: '第四步' },
];

describe('Steps (react)', () => {
  it('渲染步骤标题与 BEM 类名，默认水平方向', () => {
    const { container } = render(<Steps items={items} />);
    expect(container.querySelector('.xui-steps')?.className).toContain('is-horizontal');
    const titles = Array.from(container.querySelectorAll('.xui-steps__title')).map(
      (n) => n.textContent,
    );
    expect(titles).toEqual(items.map((i) => i.title));
  });

  it('状态推导：finish 对勾 / process 高亮 / wait 数字', () => {
    const { container } = render(<Steps items={items} defaultValue={2} />);
    const nodes = container.querySelectorAll('.xui-steps__item');
    expect(nodes[0].className).toContain('is-finish');
    expect(nodes[1].className).toContain('is-finish');
    expect(nodes[2].className).toContain('is-process');
    expect(nodes[2].className).toContain('is-current');
    expect(nodes[3].className).toContain('is-wait');
  });

  it('status 覆盖当前步骤状态（error）', () => {
    const { container } = render(<Steps items={items} defaultValue={1} status="error" />);
    expect(container.querySelectorAll('.xui-steps__item')[1].className).toContain('is-error');
  });

  it('点击步骤触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Steps items={items} onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('.xui-steps__item')[2]!);
    expect(onChange).toHaveBeenCalledWith(2);
    expect(container.querySelectorAll('.xui-steps__item')[2].className).toContain('is-current');
  });

  it('禁用步骤点击 no-op', () => {
    const onChange = vi.fn();
    const { container } = render(<Steps items={items} onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('.xui-steps__item')[1]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控 value 变更同步高亮', () => {
    const { container, rerender } = render(<Steps items={items} value={0} />);
    expect(container.querySelectorAll('.xui-steps__item')[0].className).toContain('is-current');
    rerender(<Steps items={items} value={2} />);
    expect(container.querySelectorAll('.xui-steps__item')[2].className).toContain('is-current');
  });

  it('direction 垂直布局类名', () => {
    const { container } = render(<Steps items={items} direction="vertical" />);
    expect(container.querySelector('.xui-steps')?.className).toContain('is-vertical');
  });

  it('暴露 next / prev / goTo 命令式 API', () => {
    let refObj: { next: () => void; prev: () => void; goTo: (index: number) => void } | null = null;
    const { container } = render(
      <Steps
        items={items}
        ref={(instance) => {
          refObj = instance;
        }}
      />,
    );
    act(() => {
      refObj!.next(); // 目标 1 禁用 no-op
    });
    expect(container.querySelectorAll('.xui-steps__item')[1].className).not.toContain('is-current');
    act(() => {
      refObj!.goTo(2);
    });
    expect(container.querySelectorAll('.xui-steps__item')[2].className).toContain('is-current');
    act(() => {
      refObj!.prev(); // 目标 1 禁用 no-op
    });
    expect(container.querySelectorAll('.xui-steps__item')[2].className).toContain('is-current');
  });
});
