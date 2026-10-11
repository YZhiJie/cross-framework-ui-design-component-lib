import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

/** 桩接 rect：触发器贴近视口顶部（top 空间不足），浮层 120×60 */
function stubNearTopRects() {
  const original = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
    const rect = original.call(this);
    if (this.classList?.contains('xui-tooltip__trigger')) {
      return {
        ...rect,
        top: 10,
        bottom: 50,
        left: 100,
        right: 200,
        width: 100,
        height: 40,
      } as DOMRect;
    }
    if (this.classList?.contains('xui-tooltip__popper')) {
      return {
        ...rect,
        top: 0,
        bottom: 60,
        left: 0,
        right: 120,
        width: 120,
        height: 60,
      } as DOMRect;
    }
    return rect;
  };
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original;
  };
}

describe('Tooltip (react)', () => {
  it('默认不渲染提示框，mouseEnter 显示 content，mouseLeave 收起', () => {
    const { container } = render(<Tooltip content="提示文字">目标</Tooltip>);
    expect(container.querySelector('.xui-tooltip__popper')).toBeNull();
    expect(container.textContent).toContain('目标');

    fireEvent.mouseEnter(container.firstElementChild as Element);
    const popper = container.querySelector('.xui-tooltip__popper');
    expect(popper).not.toBeNull();
    expect(popper?.textContent).toContain('提示文字');
    expect(popper?.classList.contains('is-top')).toBe(true);
    expect(popper?.getAttribute('role')).toBe('tooltip');
    expect(screen.getByRole('tooltip')).toBeTruthy();

    fireEvent.mouseLeave(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')).toBeNull();
  });

  it('placement 映射到 popper 方位类名', () => {
    const { container } = render(
      <Tooltip content="x" placement="right">
        目标
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')?.classList.contains('is-right')).toBe(
      true,
    );
  });

  it('trigger="focus" 时通过 focus / blur 控制', () => {
    const { container } = render(
      <Tooltip content="x" trigger="focus">
        目标
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')).toBeNull();

    fireEvent.focus(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')).not.toBeNull();

    fireEvent.blur(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')).toBeNull();
  });

  it('disabled 时不响应 hover，运行时禁用会收起', () => {
    const { container, rerender } = render(
      <Tooltip content="x" disabled>
        目标
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')).toBeNull();

    rerender(
      <Tooltip content="x" disabled={false}>
        目标
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as Element);
    expect(container.querySelector('.xui-tooltip__popper')).not.toBeNull();

    rerender(
      <Tooltip content="x" disabled>
        目标
      </Tooltip>,
    );
    expect(container.querySelector('.xui-tooltip__popper')).toBeNull();
  });

  it('renderContent 优先于 content prop', () => {
    const { container } = render(
      <Tooltip content="prop 内容" renderContent={() => <strong>回调内容</strong>}>
        目标
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as Element);
    const popper = container.querySelector('.xui-tooltip__popper');
    expect(popper?.textContent).toContain('回调内容');
    expect(popper?.textContent).not.toContain('prop 内容');
  });

  it('className / style 透传到根元素', () => {
    const { container } = render(
      <Tooltip content="x" className="my-x" style={{ color: 'red' }}>
        目标
      </Tooltip>,
    );
    const root = container.querySelector('.xui-tooltip') as HTMLElement;
    expect(root.classList.contains('my-x')).toBe(true);
    expect(root.classList.contains('xui-tooltip')).toBe(true);
    expect(root.style.color).toBe('red');
  });

  it('气泡渲染在 trigger 内部（flex/grid stretch 下定位基准不偏移）', () => {
    const { container } = render(
      <Tooltip content="x">
        <span>目标</span>
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as Element);
    const trigger = container.querySelector('.xui-tooltip__trigger') as HTMLElement;
    expect(trigger.querySelector(':scope > .xui-tooltip__popper')).not.toBeNull();
    expect(
      (container.querySelector('.xui-tooltip') as HTMLElement).querySelector(
        ':scope > .xui-tooltip__popper',
      ),
    ).toBeNull();
  });

  it('视口避让：首选 top 空间不足时翻转为 bottom', async () => {
    const restore = stubNearTopRects();
    try {
      const { container } = render(<Tooltip content="x">目标</Tooltip>);
      fireEvent.mouseEnter(container.firstElementChild as Element);
      await waitFor(() => {
        expect(
          container.querySelector('.xui-tooltip__popper')?.classList.contains('is-bottom'),
        ).toBe(true);
      });
    } finally {
      restore();
    }
  });
});
