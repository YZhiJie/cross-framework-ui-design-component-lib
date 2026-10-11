import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Tabs } from '../Tabs';

const ITEMS = [
  { label: '标签一', value: 'a' },
  { label: '标签二', value: 'b', disabled: true },
  { label: '标签三', value: 'c' },
];

describe('Tabs (react)', () => {
  it('渲染全部 tab，默认无激活面板', () => {
    const { container } = render(<Tabs items={ITEMS} />);
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(3);
    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
  });

  it('defaultValue 激活对应项与面板（ARIA 关联）', () => {
    const { container } = render(<Tabs items={ITEMS} defaultValue="a" />);
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].className).toContain('is-active');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    const panel = container.querySelector('[role="tabpanel"]') as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toContain('-tab-a');
    expect(panel.textContent).toBe('标签一');
  });

  it('renderPanel 渲染激活面板内容', () => {
    const { container } = render(
      <Tabs items={ITEMS} defaultValue="a" renderPanel={(item) => `面板：${item.label}`} />,
    );
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toBe('面板：标签一');
  });

  it('点击 tab 切换并触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Tabs items={ITEMS} defaultValue="a" onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('[role="tab"]')[2]);
    expect(onChange).toHaveBeenCalledWith('c');
    expect((container.querySelector('[role="tabpanel"]') as HTMLElement).textContent).toBe(
      '标签三',
    );
  });

  it('禁用 tab 点击忽略且标记 aria-disabled', () => {
    const onChange = vi.fn();
    const { container } = render(<Tabs items={ITEMS} defaultValue="a" onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('[role="tab"]')[1]);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelectorAll('[role="tab"]')[1].getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('键盘 ArrowRight 跳过禁用项、ArrowLeft 循环，焦点跟随', () => {
    const onChange = vi.fn();
    const { container } = render(<Tabs items={ITEMS} defaultValue="a" onChange={onChange} />);
    const list = container.querySelector('[role="tablist"]') as HTMLElement;
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('c');
    // 焦点跟随到新激活 tab
    expect(document.activeElement).toBe(container.querySelectorAll('[role="tab"]')[2]);
    fireEvent.keyDown(list, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  it('受控模式：点击仅回调，外部 value 更新后显示跟随', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<Tabs items={ITEMS} value="a" onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('[role="tab"]')[2]);
    expect(onChange).toHaveBeenCalledWith('c');
    // 受控：内部值未变
    expect(container.querySelectorAll('[role="tab"]')[0].className).toContain('is-active');
    rerender(<Tabs items={ITEMS} value="c" onChange={onChange} />);
    expect(container.querySelectorAll('[role="tab"]')[2].className).toContain('is-active');
    expect((container.querySelector('[role="tabpanel"]') as HTMLElement).textContent).toBe(
      '标签三',
    );
  });
});
