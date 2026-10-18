import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { Dropdown } from '../Dropdown';
import type { DropdownRef } from '../Dropdown';
import type { DropdownOption } from '@xui-design/core';

vi.useFakeTimers();

const menu: DropdownOption[] = [
  { key: 'copy', label: '复制', icon: 'user' },
  { key: 'cut', label: '剪切', disabled: true },
  { key: 'del', label: '删除', danger: true, divided: true, icon: 'unknown-icon' },
];

function getItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.xui-dropdown__item'));
}

describe('Dropdown (react)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('渲染触发元素与 BEM 类名', () => {
    const { container, getByText } = render(
      <Dropdown menu={menu} trigger="click">
        <button type="button">操作</button>
      </Dropdown>,
    );
    expect(container.firstElementChild!.className).toContain('xui-dropdown');
    expect(getByText('操作')).toBeTruthy();
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();
  });

  it('click 触发：点击打开菜单并渲染菜单项', () => {
    const { container } = render(<Dropdown menu={menu} trigger="click" />);
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);

    const items = getItems(container);
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toBe('复制');
    expect(items[0].className).not.toContain('is-danger');
    expect(items[1].className).toContain('is-disabled');
    expect(items[2].className).toContain('is-danger');
    expect(items[2].className).toContain('is-divided');
  });

  it('点击菜单项触发 onSelect（key / option 载荷）并收起菜单', () => {
    const onSelect = vi.fn();
    const onVisibleChange = vi.fn();
    const { container } = render(
      <Dropdown
        menu={menu}
        trigger="click"
        onSelect={onSelect}
        onVisibleChange={onVisibleChange}
      />,
    );
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);
    fireEvent.click(getItems(container)[0]);

    expect(onSelect).toHaveBeenCalledWith('copy', menu[0]);
    expect(onVisibleChange).toHaveBeenNthCalledWith(1, true);
    expect(onVisibleChange).toHaveBeenNthCalledWith(2, false);
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();
  });

  it('禁用菜单项点击无效（不收起、不回调）', () => {
    const onSelect = vi.fn();
    const { container } = render(<Dropdown menu={menu} trigger="click" onSelect={onSelect} />);
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);
    fireEvent.click(getItems(container)[1]);

    expect(onSelect).not.toHaveBeenCalled();
    expect(container.querySelector('.xui-dropdown__menu')).not.toBeNull();
  });

  it('disabled 组件点击触发无效', () => {
    const { container } = render(<Dropdown menu={menu} trigger="click" disabled />);
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);

    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();
    expect(container.querySelector('.xui-dropdown__trigger')!.className).toContain('is-disabled');
  });

  it('hover 触发：mouseenter 延迟打开，mouseleave 延迟收起', () => {
    const { container } = render(<Dropdown menu={menu} />);
    const trigger = container.querySelector('.xui-dropdown__trigger')!;

    fireEvent.mouseEnter(trigger);
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(container.querySelector('.xui-dropdown__menu')).not.toBeNull();

    fireEvent.mouseLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();
  });

  it('Esc 收起菜单（不触发 onSelect）', () => {
    const onSelect = vi.fn();
    const { container } = render(<Dropdown menu={menu} trigger="click" onSelect={onSelect} />);
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);
    expect(container.querySelector('.xui-dropdown__menu')).not.toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('点击外部收起菜单', () => {
    const { container } = render(<Dropdown menu={menu} trigger="click" />);
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);
    expect(container.querySelector('.xui-dropdown__menu')).not.toBeNull();

    fireEvent.mouseDown(document.body);
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();
  });

  it('ref 命令式 show / hide / toggle', () => {
    const ref = createRef<DropdownRef>();
    const { container } = render(<Dropdown menu={menu} trigger="click" ref={ref} />);

    act(() => ref.current!.show());
    expect(container.querySelector('.xui-dropdown__menu')).not.toBeNull();

    act(() => ref.current!.hide());
    expect(container.querySelector('.xui-dropdown__menu')).toBeNull();

    act(() => ref.current!.toggle());
    expect(container.querySelector('.xui-dropdown__menu')).not.toBeNull();
  });

  it('渲染已知图标、忽略未知图标', () => {
    const { container } = render(<Dropdown menu={menu} trigger="click" />);
    fireEvent.click(container.querySelector('.xui-dropdown__trigger')!);

    const items = getItems(container);
    expect(items[0].querySelector('.xui-dropdown__item-icon')).not.toBeNull();
    expect(items[2].querySelector('.xui-dropdown__item-icon')).toBeNull();
  });
});
