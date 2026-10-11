import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Popconfirm } from '../Popconfirm';

function openPopper(container: HTMLElement) {
  fireEvent.click(container.querySelector('.xui-popconfirm__trigger')!);
}

/** 桩接 rect：触发器贴近视口顶部（top 空间不足），气泡 240×160 */
function stubPopconfirmNearTopRects() {
  const original = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
    const rect = original.call(this);
    if (this.classList?.contains('xui-popconfirm__trigger')) {
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
    if (this.classList?.contains('xui-popconfirm__popper')) {
      return {
        ...rect,
        top: 0,
        bottom: 160,
        left: 0,
        right: 240,
        width: 240,
        height: 160,
      } as DOMRect;
    }
    return rect;
  };
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original;
  };
}

describe('Popconfirm (react)', () => {
  it('默认不渲染气泡，点击触发元素展开', () => {
    const { container } = render(
      <Popconfirm>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__popper')).not.toBeNull();
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
  });

  it('content 文案 + 确认 / 取消按钮渲染', () => {
    const { container } = render(
      <Popconfirm content="确认删除该条数据？">
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__content')?.textContent).toBe(
      '确认删除该条数据？',
    );
    const buttons = container.querySelectorAll('.xui-popconfirm__actions button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toBe('取消');
    expect(buttons[1].textContent).toBe('确定');
    expect(buttons[1].className).toContain('xui-button--primary');
  });

  it('renderContent 覆盖 content prop', () => {
    const { container } = render(
      <Popconfirm content="默认文案" renderContent={() => <em>自定义内容</em>}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__content')?.textContent).toBe('自定义内容');
  });

  it('确定按钮：收起 + onConfirm', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <Popconfirm onConfirm={onConfirm} onCancel={onCancel}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    fireEvent.click(container.querySelectorAll('.xui-popconfirm__actions button')[1]);
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('取消按钮：收起 + onCancel', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <Popconfirm onConfirm={onConfirm} onCancel={onCancel}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    fireEvent.click(container.querySelectorAll('.xui-popconfirm__actions button')[0]);
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('placement 类名生效', () => {
    const { container } = render(
      <Popconfirm placement="bottom">
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__popper')?.className).toContain('is-bottom');
  });

  it('disabled 时点击不展开；运行时禁用收起已开气泡', () => {
    const { container, rerender } = render(
      <Popconfirm disabled>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
    rerender(
      <Popconfirm disabled={false}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__popper')).not.toBeNull();
    rerender(
      <Popconfirm disabled={true}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
  });

  it('confirmText / cancelText 自定义', () => {
    const { container } = render(
      <Popconfirm confirmText="OK" cancelText="No">
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    const buttons = container.querySelectorAll('.xui-popconfirm__actions button');
    expect(buttons[0].textContent).toBe('No');
    expect(buttons[1].textContent).toBe('OK');
  });

  it('点击外部收起且不触发回调', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <Popconfirm onConfirm={onConfirm} onCancel={onCancel}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    expect(container.querySelector('.xui-popconfirm__popper')).not.toBeNull();
    fireEvent.mouseDown(document.body);
    expect(container.querySelector('.xui-popconfirm__popper')).toBeNull();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('className / style 透传到根元素', () => {
    const { container } = render(
      <Popconfirm className="my-x" style={{ color: 'red' }}>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    const root = container.querySelector('.xui-popconfirm') as HTMLElement;
    expect(root.classList.contains('my-x')).toBe(true);
    expect(root.classList.contains('xui-popconfirm')).toBe(true);
    expect(root.style.color).toBe('red');
  });

  it('气泡渲染在 trigger 内部（定位基准锚定触发器而非被拉伸的包裹根）', () => {
    const { container } = render(
      <Popconfirm>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    const trigger = container.querySelector('.xui-popconfirm__trigger') as HTMLElement;
    expect(trigger.querySelector(':scope > .xui-popconfirm__popper')).not.toBeNull();
    expect(
      (container.querySelector('.xui-popconfirm') as HTMLElement).querySelector(
        ':scope > .xui-popconfirm__popper',
      ),
    ).toBeNull();
  });

  it('点击气泡空白区域不触发 toggle（click 冒泡已阻断）', () => {
    const { container } = render(
      <Popconfirm>
        <button type="button">删除</button>
      </Popconfirm>,
    );
    openPopper(container);
    fireEvent.click(container.querySelector('.xui-popconfirm__content') as Element);
    expect(container.querySelector('.xui-popconfirm__popper')).not.toBeNull();
  });

  it('视口避让：首选 top 空间不足时气泡翻转到下方', async () => {
    const restore = stubPopconfirmNearTopRects();
    try {
      const { container } = render(
        <Popconfirm placement="top">
          <button type="button">删除</button>
        </Popconfirm>,
      );
      openPopper(container);
      await waitFor(() => {
        expect(
          container.querySelector('.xui-popconfirm__popper')?.classList.contains('is-bottom'),
        ).toBe(true);
      });
    } finally {
      restore();
    }
  });
});
