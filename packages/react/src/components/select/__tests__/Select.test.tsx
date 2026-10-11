import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Select } from '../Select';

const OPTIONS = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai', disabled: true },
  { label: '广州', value: 'guangzhou' },
];

describe('Select (react)', () => {
  it('未选中时渲染 placeholder', () => {
    const { container } = render(<Select options={OPTIONS} placeholder="请选择城市" />);
    expect(container.querySelector('.xui-select__placeholder')?.textContent).toBe('请选择城市');
  });

  it('defaultValue 渲染选中项 label', () => {
    const { container } = render(<Select options={OPTIONS} defaultValue="beijing" />);
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('北京');
  });

  it('点击 trigger 展开面板（ARIA）', () => {
    const { container } = render(<Select options={OPTIONS} />);
    const trigger = container.querySelector('.xui-select__trigger') as HTMLElement;
    fireEvent.click(trigger);
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    const options = container.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(3);
    expect(options[1].className).toContain('is-disabled');
    // 展开时高亮第一个可用项
    expect(options[0].className).toContain('is-active');
  });

  it('点击选项：更新选中值、收起面板、触发 onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[2]);
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('广州');
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(onChange).toHaveBeenCalledWith('guangzhou');
  });

  it('禁用项点击忽略（面板保持展开）', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} onChange={onChange} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[1]);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
  });

  it('clearable 清空并触发 onClear', () => {
    const onClear = vi.fn();
    const { container } = render(
      <Select options={OPTIONS} defaultValue="beijing" clearable onClear={onClear} />,
    );
    fireEvent.click(container.querySelector('.xui-select__clear') as HTMLElement);
    expect(container.querySelector('.xui-select__placeholder')).not.toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('disabled 点击不展开且标记 aria-disabled', () => {
    const { container } = render(<Select options={OPTIONS} disabled />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(container.querySelector('.xui-select__trigger')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('键盘：Enter 展开、ArrowDown 跳过禁用项、Enter 确认', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={OPTIONS} onChange={onChange} />);
    const trigger = container.querySelector('.xui-select__trigger') as HTMLElement;
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    // 高亮从北京跳过禁用的上海到广州
    expect(onChange).toHaveBeenCalledWith('guangzhou');
  });

  it('键盘 Escape 收起面板', () => {
    const { container } = render(<Select options={OPTIONS} />);
    const trigger = container.querySelector('.xui-select__trigger') as HTMLElement;
    fireEvent.click(trigger);
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it('受控模式：点击仅回调，外部 value 更新后显示跟随', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Select options={OPTIONS} value="beijing" onChange={onChange} />,
    );
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    fireEvent.click(container.querySelectorAll('[role="option"]')[2]);
    expect(onChange).toHaveBeenCalledWith('guangzhou');
    // 受控：内部值未变，显示仍是北京
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('北京');
    rerender(<Select options={OPTIONS} value="guangzhou" onChange={onChange} />);
    expect(container.querySelector('.xui-select__value')?.textContent).toBe('广州');
  });

  it('点击外部收起面板', () => {
    const { container } = render(<Select options={OPTIONS} />);
    fireEvent.click(container.querySelector('.xui-select__trigger') as HTMLElement);
    expect(container.querySelector('[role="listbox"]')).not.toBeNull();
    fireEvent.mouseDown(document.body);
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });
});
