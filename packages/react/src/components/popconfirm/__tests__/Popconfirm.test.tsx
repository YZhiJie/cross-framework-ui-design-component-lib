import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Popconfirm } from '../Popconfirm';

function openPopper(container: HTMLElement) {
  fireEvent.click(container.querySelector('.xui-popconfirm__trigger')!);
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
});
